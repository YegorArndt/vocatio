import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { getUserUpdateArgs } from "../utils/getUserUpdateArgs";
import { UserUpdateSchema } from "../utils/schemas";
import { ExperienceEntry, User } from "@prisma/client";
import { pick } from "lodash-es";
import { applyGpt } from "../utils/ai";
import { RouterUser } from "~/modules/init-gen/types";

const { log } = console;

export const createShadowExperience = async (
  experience: RouterUser["experience"]
) => {
  if (experience.length === 0) return;

  // TODO: array for bullet points

  const prompt = `${experience
    .map((x, i) => `@${i}: ${x.description}. [Skills: ${x.skills.join(", ")}]`)
    .join("\n")}\n
    - Goal: creating an impression of constant engagement with large-scale, high-traffic systems.
    - For that: rewrite my employment histories into concise bullet points adding "driving $1B in revenue", "serve millions of license requests daily" and similar phrases contextually appropriate to the employment history.
    - Preferably, use seconds, money, number of users and similar metrics avoiding the usage of percentage based metrics.
    - Smaller numbers should be written as numbers (e.g. 1000).
    - Each bullet point starts with a "•" and a verb.
    - As the first bullet of each employment history you should add a summary of what I did and spread the skills from what I have listed in square brackets after each employment history across the bullet points putting the most critical skills in the first bullet point (if they aren't already). Choose the skills recruiters look for the most. Remove the square brackets. Use strong verbs and zero cliches. This is the most important bullet point.
    - Arrange the order of the remaining bullet points based on their importance.
    - Try being concise.

    Constraints:
      - Do not add phrases like "driving $1B in revenue", "serve millions of license requests daily" to each bullet point. Instead add them to 1-2 bullet points per employment history.
      - Be more modest choosing numbers for metrics.
      - Do not omit details from the employment histories. Simply change the format to bullet points.

    Format of your response:
      - Return the reworded histories as JSON with keys being the indices of the employment histories (initially prefixed with "@").
        Example: {"0": "reworded history" , "1": "reworded history" ...}
      - Do not return anything else but the reworded employment histories. I'll parse the JSON and include the histories directly into the resume.
  `;

  const result = await applyGpt(prompt, "gpt-4");

  let histories;
  try {
    histories = JSON.parse(result!);
  } catch (error) {
    console.error("Error parsing JSON:", error);
    // Handle the error appropriately
  }

  return histories;
};

const getShadowExperience = async (
  user: User & { experience: ExperienceEntry[] }
) => {
  const { experience } = user;
  const shadowExperience: ExperienceEntry[] = [];

  if (experience && experience.length > 0) {
    const shadowDescriptions = await createShadowExperience(experience);

    if (!shadowDescriptions["0"]) {
      log("Error: Shadow experience could not be generated.");
      return;
    }

    experience.forEach((x, i) => {
      const withShadowDescription = {
        ...pick(x, [
          "description",
          "title",
          "place",
          "period",
          "image",
          "skills",
        ]),
        shadowDescription: shadowDescriptions[i] || x.description,
      };

      shadowExperience.push(withShadowDescription as ExperienceEntry);
    });
  }

  return shadowExperience;
};

export const usersRouter = createTRPCRouter({
  update: publicProcedure
    .input(UserUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;

      if (!userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You must be logged in to update a user record",
        });
      }

      const user = await ctx.prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (!user) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User does not exist",
        });
      }

      const data = await getUserUpdateArgs(
        input,
        user as z.infer<typeof UserUpdateSchema>
      );

      const updatedUser = await ctx.prisma.user.update({
        where: { id: userId },
        data,
      });

      return updatedUser;
    }),

  get: publicProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;

    if (!userId)
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You must be logged in to view this page",
      });

    const user = await ctx.prisma.user.findFirst({
      where: {
        id: userId,
      },
      include: {
        education: true,
        experience: true,
        contact: true,
        languages: true,
        skills: true,
        vacancies: {
          take: 100,
          orderBy: [{ createdAt: "desc" }],
        },
      },
    });

    if (!user)
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });

    return user;
  }),

  create: privateProcedure
    .input(
      /**
       * Use Clerk data
       */
      z.object({
        image: z.string(),
        name: z.string(),
        contact: z.array(z.object({ name: z.string(), value: z.string() })),
        email: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;

      if (!userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You must be logged in to create a user record",
        });
      }

      const existingUser = await ctx.prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (existingUser) return existingUser;

      const { image, name, email, contact } = input;

      const newUser = await ctx.prisma.user.create({
        data: {
          id: userId,
          name,
          image,
          email,
          contact: {
            create: contact,
          },
        },
      });

      return newUser;
    }),

  createShadowExperience: publicProcedure.mutation(async ({ ctx }) => {
    const { userId } = ctx;

    if (!userId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You must be logged in to create a user record",
      });
    }

    const existingUser = await ctx.prisma.user.findFirst({
      where: {
        id: userId,
      },
      include: {
        experience: true,
      },
    });

    if (!existingUser) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "User does not exist",
      });
    }

    if (existingUser.experience.length === 0) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "No experience provided",
      });
    }

    if (existingUser.experience[0]?.shadowDescription) {
      return existingUser;
    }

    const shadowExperience = await getShadowExperience(existingUser);

    if (!shadowExperience) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Shadow experience could not be generated",
      });
    }

    const updatedUser = await ctx.prisma.user.update({
      where: { id: userId },
      data: {
        experience: {
          deleteMany: {},
          createMany: {
            data: shadowExperience,
          },
        },
      },
    });

    return updatedUser;
  }),
});
