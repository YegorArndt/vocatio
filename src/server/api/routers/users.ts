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
import { RouterUser } from "~/modules/types";

const { log } = console;

export const generateEnhancedDescriptions = async (
  experience: RouterUser["experience"]
) => {
  if (experience.length === 0) return;

  // TODO: array for bullet points

  const prompt = `My experience entries: ${experience
    .map((x, i) => `@${i}: ${x.description}. [Skills: ${x.skills.join(", ")}]`)
    .join("\n")}\n
    
    Each separate experience entry is prefixed with "@" follow by its index. So we have a total of ${
      experience.length
    } experience entries.
    
    We will improve these experience entries by adhering to best resume writing practices in 3 steps.
    
    Step 1. Rewrite each experience entry into concise bullet points. 
    Conditions for this step: 1) each bullet point starts with a "•" and a verb in past simple, 2) omit personal pronouns, filler words and colloquial language from the summary to maintain a professional tone, 3) compose the bullet point the way the best resumes for FAANG companies are composed.
    
    Step 2. Using the output from step 1, focus on the first bullet point of each (@{index} is considered a start of a new experience entry) experience entry. In the first bullet point, write a summary of the respective experience entry mentioning as many skills as possible. Keep the remanining bullet points as is.
    
    Step 3. Using the output from step 2, create an impression of constant engagement with large-scale, high-traffic systems by  adding phrases like "driving $1B in revenue", "serve millions of license requests daily" and similar phrases contextually appropriate to the experience entry / bullet point. Come up with more phrases on your own.
    Conditions for this step: 
    1) preferably, use money and time metrics, avoiding the usage of percentage based metrics - though not entirely, 
    2) smaller numbers should be written as numbers (e.g. 1000), 
    3) the number of bullet points in the output for this step must be the exact number of bullet points you came up during first step.
    
    As a starting point for each step use the respective experience entry from the previous step.
    
    Format of your response:
    - Return the experience entries as JSON with keys being the indices of the experience entries (initially prefixed with "@"). I'm only interested in receiving the results of the third step. Perform all the steps in your memory, but return the third one for each experience entry.
    Example: { "0": { "step3": ... } }
    - Do not return anything else but the reworded experience entries. I'll parse the JSON and include the histories directly into the resume.
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

const getEnhancedExperience = async (
  user: User & { experience: ExperienceEntry[] }
) => {
  const { experience } = user;
  const enhancedExperience: ExperienceEntry[] = [];

  if (experience && experience.length > 0) {
    const enhancedDescriptions = await generateEnhancedDescriptions(experience);

    if (!enhancedDescriptions["0"]) {
      log("Error: Shadow experience could not be generated.");
      return;
    }

    experience.forEach((x, i) => {
      const withEnhancedDescription = {
        ...pick(x, [
          "description",
          "title",
          "place",
          "period",
          "image",
          "skills",
        ]),
        enhancedDescription: enhancedDescriptions[i]["step-3"] || x.description,
      };

      // @ts-ignore
      enhancedExperience.push(withEnhancedDescription);
    });
  }

  return enhancedExperience;
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

      // @ts-ignore
      const data = await getUserUpdateArgs(input, user);

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

  generateEnhancedExperience: publicProcedure.mutation(async ({ ctx }) => {
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

    if (existingUser.experience[0]?.enhancedDescription) {
      return existingUser;
    }

    const enhancedExperience = await getEnhancedExperience(existingUser);

    if (!enhancedExperience) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Enhanced experience could not be generated",
      });
    }

    const updatedUser = await ctx.prisma.user.update({
      where: { id: userId },
      data: {
        enhancementsCount: existingUser.enhancementsCount - 1,
        experience: {
          deleteMany: {},
          createMany: {
            data: enhancedExperience,
          },
        },
      },
    });

    return updatedUser;
  }),
});
