import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { getUserUpdateArgs } from "../utils/getUserUpdateArgs";
import { UserUpdateSchema } from "../utils/schemas";
import { applyGpt } from "../utils/ai";
import { Bullet } from "@prisma/client";

const { log } = console;

const parse = (gptResponse: string | undefined) => {
  if (!gptResponse) return;
  let parsed: { bullets: string[] } = { bullets: [] };

  try {
    parsed = JSON.parse(gptResponse);
  } catch (error) {}

  return parsed;
};

const breakDownIntoBullets = async (description: string) => {
  const prompt = `
    "${description}".

    Task: rewrite to concise bullet points.
    Format of your response: return a JSON with the shape of { bullets: string[] } where each string is a bullet point. Do not reply with anything else but the JSON.
  `;
  const gptResponse = await applyGpt(prompt);
  const parsed = parse(gptResponse);

  return parsed;
};

export const usersRouter = createTRPCRouter({
  silentlyCreateBullets: publicProcedure.mutation(async ({ ctx }) => {
    const { userId } = ctx;

    if (!userId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You must be logged in to update a user record",
      });
    }

    const user = await ctx.prisma.user.findFirst({
      where: {
        id: userId,
      },
      include: {
        experience: { include: { bullets: true } },
      },
    });

    if (!user) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "User does not exist",
      });
    }

    const { experience } = user;
    const firstExperience = experience?.[0];
    if (!firstExperience) return;
    const { bullets } = firstExperience;
    if (bullets?.length && bullets.length > 0) return;

    const resultBullets: Pick<Bullet, "entryId" | "value">[] = [];

    await Promise.all(
      experience.map(async (exp) => {
        const { description } = exp;
        if (!description) return exp;

        const parsed = await breakDownIntoBullets(description);
        if (!parsed) return;

        const { bullets } = parsed;
        if (!bullets || !bullets.length || !exp.id) return;

        const formattedBullets = bullets.map((bullet) => ({
          value: bullet,
          entryId: exp.id!,
        }));

        resultBullets.push(...formattedBullets);
      })
    );

    const result = await ctx.prisma.bullet.createMany({
      data: resultBullets,
    });

    return result;
  }),

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

      const user = await ctx.prisma.user.findFirst({
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
        experience: {
          include: {
            bullets: true,
          },
        },
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
});
