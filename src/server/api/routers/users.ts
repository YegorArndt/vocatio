import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";

const { log } = console;

const entries = [
  "education",
  "employmentHistory",
  "recommendations",
  "certifications",
  "awards",
  "languages",
  "skills",
];

const SkillLevelEnum = z.enum([
  "BASIC",
  "INTERMEDIATE",
  "ADVANCED",
  "EXPERT",
  "NATIVE",
]);

const ProfessionFieldEnum = z.enum([
  "FRONTEND",
  "BACKEND",
  "FULLSTACK",
  "SECURITY",
  "PROJECT_MANAGER",
  "PRODUCT_MANAGER",
  "DATA_SCIENTIST",
  "DEVOPS",
  "UI_UX_DESIGNER",
  "SYSTEM_ADMINISTRATOR",
  "DATABASE_ADMINISTRATOR",
  "MOBILE_DEVELOPER",
  "EMBEDDED_DEVELOPER",
  "QA",
  "NETWORK_ENGINEER",
  "CLOUD_ENGINEER",
  "MACHINE_LEARNING_ENGINEER",
  "ANALYST",
  "SCRUM_MASTER",
]);

const EntrySchema = z.array(
  z.object({
    id: z.string().optional(),
    place: z.string(),
    period: z.string(),
    description: z.string(),
    descriptionSummary: z.string().optional(),
    image: z.string(),
    title: z.string(),
    employmentHistoryId: z.string().optional(),
    recommendationsId: z.string().optional(),
    awardsId: z.string().optional(),
    certificatesId: z.string().optional(),
  })
);

const SkillSchema = z.array(
  z.object({
    languageId: z.string().optional(),
    skillId: z.string().optional(),
    id: z.string().optional(),
    name: z.string(),
    level: SkillLevelEnum,
  })
);

const UpdateSchema = z.object({
  name: z.string().optional(),
  image: z.string().optional(),
  country: z.string().optional(),
  contact: z
    .object({
      email: z.string(),
      phone: z.string().optional(),
      github: z.string().optional(),
      linkedin: z.string().optional(),
      indeed: z.string().optional(),
      glassdoor: z.string().optional(),
      hh: z.string().optional(),
      facebook: z.string().optional(),
      instagram: z.string().optional(),
      twitter: z.string().optional(),
      telegram: z.string().optional(),
      skype: z.string().optional(),
      vk: z.string().optional(),
      website: z.string().optional(),
      address: z.string().optional(),
      country: z.string().optional(),
      city: z.string().optional(),
      zip: z.string().optional(),
    })
    .optional(),
  jobTitle: z.string().optional(),
  professionField: ProfessionFieldEnum.optional(),
  languages: SkillSchema.optional(),
  skills: SkillSchema.optional(),
  education: EntrySchema.optional(),
  employmentHistory: EntrySchema.optional(),
  recommendations: EntrySchema.optional(),
  awards: EntrySchema.optional(),
  certificates: EntrySchema.optional(),
  professionalSummary: z.string().optional(),
});

export type UserUpdateInput = z.infer<typeof UpdateSchema>;

export const usersRouter = createTRPCRouter({
  get: publicProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;

    if (!userId)
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You must be logged in to view this page",
      });

    const user = await ctx.prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        education: true,
        employmentHistory: true,
        contact: true,
        languages: true,
        skills: true,
        recommendations: true,
        shortLinkedin: true,
        vacancies: true,
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
        name: z.string(),
        image: z.string(),
        contact: z.object({
          email: z.string(),
          phone: z.string().optional(),
        }),
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

      const { image, name, contact } = input;

      const newUser = await ctx.prisma.user.create({
        data: {
          id: userId,
          name,
          image,
          contact: {
            create: contact,
          },
        },
      });

      return newUser;
    }),

  update: publicProcedure
    .input(UpdateSchema)
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

      const definedUser = {};

      Object.entries(input).forEach(([key, value]) => {
        if (key === "contact") {
          definedUser[key] = {
            update: value,
          };
        }
        if (entries.includes(key) && Array.isArray(value)) {
          definedUser[key] = {
            deleteMany: {},
            createMany: {
              data: value,
            },
          };
        } else if (
          value !== null &&
          value !== undefined &&
          value !== "" &&
          key !== "contact"
        ) {
          definedUser[key] = value;
        }
      });

      log(definedUser);

      const updatedUser = await ctx.prisma.user.update({
        where: { id: userId },
        data: definedUser,
      });

      return updatedUser;
    }),

  getByVacancyId: publicProcedure
    .input(
      z.object({
        vacancyId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { userId } = ctx;
      const { vacancyId } = input;

      const vacancy = await ctx.prisma.vacancy.findUnique({
        where: {
          id: vacancyId,
        },
        include: {
          users: true,
        },
      });

      if (!vacancy) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Vacancy does not exist",
        });
      }

      const user = vacancy.users.find((user) => user.id === userId);

      if (!user) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User does not exist",
        });
      }

      return user;
    }),
});
