import { v4 as uuidv4 } from "uuid";

import type { GeneratedDraft } from "../create/design/types";

export const formatSkills = (skills: string[]) =>
  skills.map((x) => ({ id: uuidv4(), name: x }));

/**
 * Parse GPT response for skills.
 */
export const parseSkills = (skillsPromptReturn: string | undefined) => {
  let vacancySkills = [] as GeneratedDraft["vacancySkills"];
  let generatedSkills = [] as GeneratedDraft["generatedSkills"];
  let vacancyResponsibilities = [] as GeneratedDraft["vacancyResponsibilities"];

  try {
    if (!skillsPromptReturn) throw new Error("No response from AI");

    const {
      vacancySkills: vs,
      generatedSkills: gs,
      vacancyResponsibilities: vr,
    } = JSON.parse(skillsPromptReturn);

    const formattedSkills = formatSkills(gs);

    vacancySkills = vs;
    generatedSkills = formattedSkills;
    vacancyResponsibilities = vr;
  } catch (error) {}

  return { vacancySkills, generatedSkills, vacancyResponsibilities };
};

export const parseExperience = (experiencePromptReturn: string | undefined) => {
  let json = {} as {
    tuples: [string, string][];
    mergedTuples: string[];
  };

  try {
    if (!experiencePromptReturn) throw new Error("No response from AI");
    const parsed = JSON.parse(experiencePromptReturn);
    json = parsed;
  } catch (error) {}

  const renamed = {
    generatedExperience: json.mergedTuples.filter((x) => x.length > 0),
  };

  return renamed;
};
