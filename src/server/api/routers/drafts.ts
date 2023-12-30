import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { pick } from "lodash-es";
import { prisma } from "~/server/db";
import { type ChatCompletionRequestMessage } from "openai";
import type {
  DraftEmploymentHistoryEntry,
  EmploymentHistoryEntry,
  User,
  Vacancy,
} from "@prisma/client";

import { applyGpt } from "../utils/ai";

const { log } = console;

export const rearrangeSkillsByRelevance = (
  vacancyDescription: string,
  skillsArray: string[]
): string[] => {
  const vacancyWords = new Set(vacancyDescription.toLowerCase().match(/\w+/g));

  const skillScores = skillsArray.map((skill) => {
    const skillWords = new Set(skill.toLowerCase().match(/\w+/g));
    const intersection = new Set(
      [...skillWords].filter((word) => vacancyWords.has(word))
    );
    return { skill, score: intersection.size };
  });

  return skillScores
    .sort((a, b) => b.score - a.score)
    .map((item) => item.skill);
};

export const getResponsibilities = (vacancy: Vacancy) => {
  const { requiredSkills } = vacancy;

  /**
   * ...suffice as context for AI.
   */
  const requiredSkillsSuffice = requiredSkills.length > 100;
  if (requiredSkillsSuffice) return vacancy.requiredSkills;

  const partialDescription = vacancy.description.split(":")[1];

  return partialDescription
    ? partialDescription.slice(-100)
    : vacancy.description;
};

export const getPrompt = (
  vacancy: Vacancy,
  user: User & { employmentHistory: EmploymentHistoryEntry[] }
): ChatCompletionRequestMessage[] => {
  const { companyName, jobTitle } = vacancy;
  const { employmentHistory, professionalSummary } = user;

  const responsibilities = getResponsibilities(vacancy);
  const employmentHistories = employmentHistory
    .map((x, i) => `@${i}: ${x.description}.`)
    .join(" ");

  // TODO: different instuctions for summary and employment histories
  return [
    {
      role: "system",
      content: `You're a highly creative resume writer who specializes in tailoring resumes to job requirements. 
      Adjust and rephrase my professional summary & employment histories to the job requirements.

      Vacancy: ${companyName} is looking for ${jobTitle}. Key responsibilities: ${responsibilities}.
      My summary: ${professionalSummary}.
      My employment histories: ${employmentHistories}.

      Prefix resulting employment histories with "@" and its number (zero-based). 
      Write in the first person. 
      Translate the professional summary & employment histories to the vacancy language. 
      Return only the summary & employment histories.
      Use fixed number for experience years if need be.
      Use as many keywords & phrases from the vacancy as possible. Creatively integrate them.
      When composing the summary, identify the most important responsibilities and creatively rephrase the summary including them.
      `,
    },
  ];
};

export const extractFromString = (enhancedContent: string | undefined) => {
  if (!enhancedContent) return { isSuccessfullyEnhanced: false };

  enhancedContent = enhancedContent.replace(
    /Professional Summary:|Summary:|Employment Histories:|Employment History:/gi,
    ""
  );

  const [summary, historiesContent] = enhancedContent.split(/(?=@0)/, 2);

  if (!summary || !historiesContent) return { isSuccessfullyEnhanced: false };

  const histories = {} as Record<string, string>;
  const historyRegex = /@(\d+): ([\s\S]*?)(?=@\d+:|$)/g;
  let match;

  while ((match = historyRegex.exec(historiesContent)) !== null) {
    const historyIndex = match[1]!;
    const historyText = match[2]!.trim();
    histories[historyIndex] = historyText;
  }

  return { summary: summary.trim(), histories, isSuccessfullyEnhanced: true };
};

const tailor = async (
  vacancy: Vacancy,
  user: User & { employmentHistory: EmploymentHistoryEntry[] }
) => {
  const prompt = getPrompt(vacancy, user);
  const tailored = await applyGpt(prompt);

  const {
    summary: professionalSummary = user.professionalSummary,
    histories,
    isSuccessfullyEnhanced,
  } = extractFromString(tailored);

  let employmentHistory: Partial<DraftEmploymentHistoryEntry>[] =
    user.employmentHistory.map((entry) => {
      const skills = rearrangeSkillsByRelevance(
        vacancy.description,
        entry.skills
      );

      return {
        ...pick(entry, ["period", "place", "title", "image", "description"]),
        originalEmploymentHistoryEntryId: entry.id,
        skills,
      };
    });

  if (isSuccessfullyEnhanced) {
    employmentHistory = employmentHistory.map((entry, index) => {
      const matchFromEnhanced =
        histories![index.toString() as keyof typeof histories];

      return {
        ...entry,
        description: matchFromEnhanced || entry.description,
      };
    });
  }

  return { professionalSummary, employmentHistory };
};

export const draftsRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        vacancyId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;
      const { vacancyId } = input;

      if (!userId)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to perform this action",
        });

      const user = await ctx.prisma.user.findFirst({
        where: { id: userId },
        include: { employmentHistory: true },
      });

      if (!user)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });

      const vacancy = await ctx.prisma.vacancy.findFirst({
        where: { id: vacancyId },
      });

      if (!vacancy)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Vacancy not found",
        });

      const tailored = await tailor(vacancy, user);

      const draft = await prisma.draft.create({
        data: {
          professionalSummary: tailored.professionalSummary,
          jobTitle: vacancy.jobTitle,
          userId,
          vacancyId: vacancy.id,
          employmentHistory: {
            create: tailored.employmentHistory as DraftEmploymentHistoryEntry[],
          },
        },
      });

      return draft;
    }),

  getById: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { userId } = ctx;

      if (!userId)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to perform this action",
        });

      const { id } = input;

      const draft = await ctx.prisma.draft.findFirst({
        where: {
          id,
          userId,
        },
        include: {
          employmentHistory: true,
        },
      });

      if (!draft)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Draft not found",
        });

      return draft;
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;

    if (!userId)
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You are not authorized to perform this action",
      });

    const drafts = await ctx.prisma.draft.findMany({
      where: { userId },
      take: 100,
      orderBy: [{ createdAt: "desc" }],
    });

    return drafts;
  }),

  getByVacancyId: publicProcedure
    .input(
      z.object({
        vacancyId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { userId } = ctx;

      if (!userId)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to perform this action",
        });

      const { vacancyId } = input;

      const draft = await ctx.prisma.draft.findFirst({
        where: {
          userId,
          vacancyId,
        },
        include: {
          employmentHistory: true,
        },
      });

      if (!draft)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Draft not found",
        });

      return draft;
    }),
});
