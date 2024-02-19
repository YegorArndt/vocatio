import { v4 as uuidv4 } from "uuid";
import { GeneratedData } from "./types";

const { log } = console;

export const formatSkills = (skills: string[]) =>
  skills.map((x) => ({ id: uuidv4(), name: x }));

/**
 * Parse GPT response for skills.
 */
export const parseSkills = (skillsPromptReturn: string | undefined) => {
  let vacancySkills = [] as GeneratedData["vacancySkills"];
  let generatedSkills = [] as GeneratedData["generatedSkills"];
  let generatedProfessionalSummary = "";

  try {
    if (!skillsPromptReturn) throw new Error("No response from AI");

    const {
      vacancySkills: vs,
      generatedSkills: gs,
      professionalSummary,
    } = JSON.parse(skillsPromptReturn);

    vacancySkills = vs;
    generatedSkills = formatSkills(gs);
    generatedProfessionalSummary = professionalSummary;
  } catch (error) {}

  return { vacancySkills, generatedSkills, generatedProfessionalSummary };
};

/**
 * Parse GPT response for experience.
 */
export const parseExperience = (experiencePromptReturn: string | undefined) => {
  let json = {} as {
    vacancyResponsibilities: string[];
    tuples: [string, string][];
    mergedTuples: string[];
  };

  try {
    if (!experiencePromptReturn) throw new Error("No response from AI");
    const parsed = JSON.parse(experiencePromptReturn);
    json = parsed;
  } catch (error) {}

  const renamed = {
    generatedExperience: json?.mergedTuples?.filter((x) => x.length > 0),
    vacancyResponsibilities: json?.vacancyResponsibilities,
  };

  return renamed;
};
