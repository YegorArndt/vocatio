import type { ExperienceEntry } from "@prisma/client";
import { pick } from "lodash-es";
import { Models, PartialVacancy, RouterUser } from "~/modules/extension/types";
import { v4 as uuidv4 } from "uuid";

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

export const formatExperience = (
  histories: ExperienceEntry[],
  vacancyDescription: string
) => {
  return histories
    .map(
      (x, i) =>
        // prettier-ignore
        `@${i}: ${x.shadowDescription}`
    )
    .join("\n");
};

export const getTopSkills = (vacancy: PartialVacancy, user: RouterUser) =>
  rearrangeSkillsByRelevance(
    vacancy.description!,
    Array.from(
      new Set(
        [
          ...user.skills!.map((x) => x.name),
          ...user.experience!.map((x) => x.skills),
        ].flat()
      )
    )
  );

export const compressResponsbilities = (r: string) => {
  return r;
};

export const getResponsibilities = (
  vacancy: PartialVacancy,
  model?: Models
) => {
  const { requiredSkills, description } = vacancy;

  return description;

  // const isRequiredSkillsLong = requiredSkills && requiredSkills.length > 300;

  // const responsibilities = compressResponsbilities(
  //   (isRequiredSkillsLong ? requiredSkills : description)!
  // );

  // return responsibilities;
};

export const formatResponse = (enhancedContent: string | undefined) => {
  if (!enhancedContent) return { isSuccessfullyEnhanced: false };

  // Remove unwanted headers
  const enhancedContentCopy = enhancedContent.replace(
    /Professional Summary:|Summary:|Employment Histories:|Employment History:|Employment History|Summary|Professional Summary/gi,
    ""
  );

  // Split the content into summary and histories
  const [summary, historiesContent] = enhancedContentCopy.split(/(?=@0)/, 2);

  if (!summary || !historiesContent) return { isSuccessfullyEnhanced: false };

  // Remove the "1.", "2.", etc., patterns before each history entry
  const cleanedHistoriesContent = historiesContent.replace(
    /\b\d+\.\s*(?=@\d+:)/g,
    ""
  );

  // Process each history entry
  const histories = {} as Record<string, string>;
  const historyRegex = /@(\d+):\s*([\s\S]*?)(?=@\d+:|$)/g;
  let match;

  while ((match = historyRegex.exec(cleanedHistoriesContent)) !== null) {
    const historyIndex = match[1]!;
    const historyText = match[2]!.trim();
    histories[historyIndex] = historyText;
  }

  return { summary: summary.trim(), histories, isSuccessfullyEnhanced: true };
};

type MixWithOriginalHistoriesProps = {
  originalHistories: ExperienceEntry[];
  enhancedHistories: ReturnType<typeof formatResponse>["histories"];
  vacancy: PartialVacancy;
};

export const mixWithOriginalHistories = (
  props: MixWithOriginalHistoriesProps
) => {
  const { originalHistories, enhancedHistories, vacancy } = props;

  const experience = originalHistories.map((x, index) => {
    return {
      ...pick(x, ["period", "place", "title", "image"]),
      skills: rearrangeSkillsByRelevance(vacancy.description!, x.skills),
      description:
        enhancedHistories?.[index] ||
        enhancedHistories?.[index.toString()] ||
        x.shadowDescription ||
        x.description,
      originalExperienceEntryId: x.id,
      id: uuidv4(),
    };
  });

  return experience;
};

export const boldKeywords = (
  experience: ExperienceEntry[],
  vacancy: PartialVacancy
) => {
  return experience.map((x) => {
    const experienceSkills = x.skills;
    const vacancyText = vacancy.description?.toLowerCase();

    const description = x.description;

    experienceSkills?.forEach((skill) => {
      // Run experience skills against vacancy text finding all matches and replacing them with bolded version.
      const regex = new RegExp(`\\b${skill.toLowerCase()}\\b`, "g");
      const matches = vacancyText?.match(regex);
      description?.replace(regex, `<b>${matches}</b>`);
    });

    return { ...x, description };
  });
};
