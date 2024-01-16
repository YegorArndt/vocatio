import type { EmploymentHistoryEntry } from "@prisma/client";
import { pick } from "lodash-es";
import { v4 as uuidv4 } from "uuid";

import { instruct, hfFormat, applyGpt } from "./ai";
import type { PartialUser, PartialVacancy } from "~/modules/extension/types";

const { log } = console;

const max_new_tokens = 3000;

export const getResponsibilities = (vacancy: PartialVacancy) => {
  const { requiredSkills } = vacancy;

  return vacancy.description!;

  /**
   * ...suffice as context for AI.
   */
  // const requiredSkillsSuffice = requiredSkills && requiredSkills.length > 300;
  // if (requiredSkillsSuffice) return vacancy.requiredSkills as string;

  // const partialDescription = vacancy.description!.split(":")[1];

  // return (
  //   partialDescription ? partialDescription : vacancy.description
  // ) as string;
};

export const formatEmploymentHistories = (
  histories: EmploymentHistoryEntry[]
) => {
  return histories.map((x, i) => `@${i}: ${x.description}.`).join(" ");
};

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

export const getTopSkills = (vacancy: PartialVacancy, user: PartialUser) =>
  rearrangeSkillsByRelevance(
    vacancy.description!,
    Array.from(
      new Set(
        [
          ...user.skills.map((x) => x.name),
          ...user.employmentHistory!.map((x) => x.skills),
        ].flat()
      )
    )
  );

const getStringPrompt = ({
  companyName,
  jobTitle,
  responsibilities,
  professionalSummary,
  employmentHistories,
}: Record<string, string>) => `
You are a resume writer with the task of customizing a resume for a specific job opening.
    Context:
      Vacancy: "${companyName} seeks a ${jobTitle}. Key responsibilities include: ${responsibilities}".
      Professional summary: "${professionalSummary}".
      Employment histories: "${employmentHistories}".

    Instructions:
      1. Identify the key responsibilities.
      2. Rewrite each employment history into exactly 6 bullet points. Each bullet point should be straight to the point. If a bullet point can attest to the candidate's ability to perform a key responsibility, make it a paraphrase of the key responsibility and put it on top. The bullet point should include the most critical keywords from the responsibility (React, GraphQL, marketing, security etc). The paraphrase is done by not adding the new text, but replacing the existing one with the key responsibility terminology. Each bullet point should start with "•".
      3. Ensure the professional summary reflects the most critical responsibilities from the vacancy in no more than 5 sentences. It should be a combined version of the original professional summary and the one where the critical responsibilities are reflected.

    Format of your response:
      Prefix each employment history entry with an "@" followed by its index (zero-based). Do not prefix the summary.
      Maintain a first-person narrative style. 
      Translate the professional summary & employment histories into the language in which the vacancy is written. This is really important.
      Return only the reworded professional summary and tailored employment histories. Don't wrap them with quotation marks.
      Use fixed numbers for years of experience where necessary.`;

export const getPrompt = (vacancy: PartialVacancy, user: PartialUser) => {
  const { companyName, jobTitle } = vacancy;
  const { employmentHistory, professionalSummary } = user;

  /**
   * TODO: handle missing data.
   */

  const responsibilities = getResponsibilities(vacancy);
  const employmentHistories = formatEmploymentHistories(employmentHistory);
  const prompt = getStringPrompt({
    companyName: companyName!,
    jobTitle: jobTitle!,
    responsibilities,
    professionalSummary: professionalSummary!,
    employmentHistories,
  });

  return prompt;
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

export const mixWithOriginalHistories = (
  originalHistories: EmploymentHistoryEntry[],
  enhancedHistories: ReturnType<typeof formatResponse>["histories"],
  vacancy: PartialVacancy
) => {
  if (!enhancedHistories) return;

  const employmentHistory = originalHistories.map((x, index) => {
    const description = enhancedHistories[index.toString()];

    return {
      ...pick(x, ["period", "place", "title", "image"]),
      skills: rearrangeSkillsByRelevance(vacancy.description!, x.skills),
      description: description || x.description,
      originalEmploymentHistoryEntryId: x.id,
      id: uuidv4(),
    };
  });

  return employmentHistory;
};

export const tryMixtral = async (
  vacancy: PartialVacancy,
  user: PartialUser
) => {
  const prompt = getPrompt(vacancy, user);

  const tailored = await instruct(
    `<s>[INST] ${prompt} ${hfFormat}.[/INST]</s>`,
    {
      max_new_tokens,
    }
  );

  const extracted = tailored.generated_text.split("</s>")[1];
  const formatted = formatResponse(extracted);
  const { summary, histories, isSuccessfullyEnhanced } = formatted;

  const employmentHistory = mixWithOriginalHistories(
    user.employmentHistory,
    histories,
    vacancy
  );

  return {
    professionalSummary: summary,
    employmentHistory,
    isSuccessfullyEnhanced,
  };
};

export const tryGpt = async (vacancy: PartialVacancy, user: PartialUser) => {
  const content = getPrompt(vacancy, user);
  const result = await applyGpt([{ role: "system", content }]);

  const formatted = formatResponse(result);
  const { summary, histories, isSuccessfullyEnhanced } = formatted;

  const employmentHistory = mixWithOriginalHistories(
    user.employmentHistory,
    histories,
    vacancy
  );

  return {
    professionalSummary: summary,
    employmentHistory,
    isSuccessfullyEnhanced,
  };
};

export const generateDraft = async (
  vacancy: PartialVacancy,
  user: PartialUser
) => {
  let { professionalSummary, employmentHistory, isSuccessfullyEnhanced } =
    await tryGpt(vacancy, user);

  if (!isSuccessfullyEnhanced) {
    ({ professionalSummary, employmentHistory } = await tryMixtral(
      vacancy,
      user
    ));
  }

  const topSkills = getTopSkills(vacancy, user);

  return {
    ...user,
    professionalSummary: professionalSummary || user.professionalSummary,
    employmentHistory:
      employmentHistory ||
      user.employmentHistory.map((x) => ({
        ...x,
        id: uuidv4(),
        originalEmploymentHistoryEntryId: x.id,
      })),
    jobTitle: vacancy.jobTitle || user.jobTitle || "Software Engineer",
    topSkills,
    vacancyId: vacancy.id,
  };
};
