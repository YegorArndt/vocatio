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
        `@${i}: ${x.shadowDescription}. [${x.skills.map((x) => `${x}`).join(", ")}]`
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

  return requiredSkills;

  // const isRequiredSkillsLong = requiredSkills && requiredSkills.length > 300;

  // const responsibilities = compressResponsbilities(
  //   (isRequiredSkillsLong ? requiredSkills : description)!
  // );

  // return responsibilities;
};

export const formatResponse = (enhancedContent: string | undefined) => {
  if (!enhancedContent) return { isSuccessfullyEnhanced: false };

  const enhancedContentCopy = enhancedContent.replace(
    /Professional Summary:|Summary:|Employment Histories:|Employment History:|Employment History|Summary|Professional Summary/gi,
    ""
  );

  const [summary, historiesContent] = enhancedContentCopy.split(/(?=@0)/, 2);

  if (!summary || !historiesContent) return { isSuccessfullyEnhanced: false };

  const histories = {} as Record<string, string>;
  const historyRegex = /@(\d+):\s*([\s\S]*?)(?=@\d+:|$)/g;
  let match;

  while ((match = historyRegex.exec(historiesContent)) !== null) {
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
    // Verwenden Sie einen regulären Ausdruck für die Übereinstimmung unter Ignorierung der Groß-/Kleinschreibung
    const relevantSkills = x.skills.filter((skill) =>
      new RegExp(skill, "i").test(vacancy.description!)
    );

    // Erstellen Sie einen regulären Ausdruck, der alle relevanten Fähigkeiten (case-insensitive) umfasst
    const regex = new RegExp(relevantSkills.join("|"), "gi");

    const description = x.description.replace(
      regex,
      (match) => `<b>${match}</b>`
    );

    log(description);

    return { ...x, description };
  });
};