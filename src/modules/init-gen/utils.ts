import { getLsGeneratedData, setLsGeneratedData } from "~/utils/ls";
import { buildExperiencePrompt, buildSkillsPrompt } from "./prompts";
import { applyGpt } from "~/server/api/utils/ai";
import { parseExperience, parseSkills } from "./parsers";
import { toast } from "sonner";
import { GeneratedData } from "./types";
import { PartialVacancy, RouterUser } from "../types";
import {
  Events,
  ExperienceGeneratedDetail,
  SkillsUpdatedDetail,
  eventManager,
} from "../EventManager";

const { log } = console;

const escapeRegExp = (s: string) => {
  // This function escapes special characters for regex
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

/**
 * Tech debt. This function is a mess.
 */
const processExperience = (
  enhancedExperience: { generatedExperience: string[] },
  user: RouterUser,
  vacancy: PartialVacancy
): ExperienceGeneratedDetail => {
  // Check if companyName is provided
  if (vacancy.companyName) {
    const companyNameRegex = new RegExp(escapeRegExp(vacancy.companyName), "g");

    return user.experience.map((x, i) => ({
      ...x,
      description:
        i === 0
          ? enhancedExperience.generatedExperience.map((g) =>
              g.replaceAll(companyNameRegex, x.place)
            )
          : toBulletPointArray(x.description!),
    }));
  } else {
    // If companyName is not provided, return the experience without modification
    return user.experience.map((x) => ({
      ...x,
      description: x.description ? toBulletPointArray(x.description) : [],
    }));
  }
};

const generateSkills = async (vacancy: PartialVacancy, user: RouterUser) => {
  try {
    const skillsPrompt = buildSkillsPrompt(user, vacancy);
    const skillsResponse = await applyGpt(skillsPrompt);
    const parsedSkills = parseSkills(skillsResponse);

    eventManager.emit<SkillsUpdatedDetail>(
      Events.SKILLS_UPDATED_EVENT,
      parsedSkills.generatedSkills
    );

    return parsedSkills;
  } catch (error) {
    toast.error("Error generating skills");
    throw error;
  }
};

/**
 * @description Generates experience for the first entry.
 */
const generateExperience = async (
  vacancy: PartialVacancy,
  user: RouterUser
) => {
  try {
    const experiencePrompt = buildExperiencePrompt(vacancy, user);
    const experienceResponse = await applyGpt(experiencePrompt);
    return parseExperience(experienceResponse);
  } catch (error) {
    toast.error("Error generating experience");
    throw error;
  }
};

const toBulletPointArray = (enhancedDescription: string) =>
  enhancedDescription
    .split("• ")
    .slice(1)
    .map((point) => "• " + point.trim());

type InitDraftProps = {
  vacancy: PartialVacancy;
  user: RouterUser;
  handleExistingDraft?: () => void;
  onComplete: (x: GeneratedData) => void;
};

export const initDraft = async (props: InitDraftProps) => {
  const { vacancy, user, handleExistingDraft, onComplete } = props;

  if (getLsGeneratedData(vacancy.id)) {
    handleExistingDraft?.();
    return;
  }

  const newGen: GeneratedData = {
    generatedExperience: [],
    generatedProfessionalSummary: "",
    generatedSkills: [],
    vacancy,
    vacancyResponsibilities: [],
    vacancySkills: [],
    ...user,
  };

  setLsGeneratedData(newGen);
  const gen = await genData(newGen, user);

  onComplete(gen);
};

const genData = async (gen: GeneratedData, user: RouterUser) => {
  const { vacancy } = gen;
  toast.loading("Writing CV...", { duration: Infinity });

  try {
    /**
     * Generate skills and experience with `GPT-3.5`
     */
    const [skillsContext, experienceContext] = await Promise.all([
      generateSkills(vacancy, user),
      generateExperience(vacancy, user),
    ]);

    const generatedExperience = processExperience(
      experienceContext,
      user,
      vacancy
    );

    eventManager.emit<ExperienceGeneratedDetail>(
      Events.EXPERIENCE_GENERATED_EVENT,
      generatedExperience
    );

    const generatedData: GeneratedData = {
      ...gen,
      vacancySkills: skillsContext.vacancySkills,
      generatedSkills: skillsContext.generatedSkills,
      generatedProfessionalSummary: skillsContext.generatedProfessionalSummary,
      generatedExperience,
      vacancyResponsibilities: experienceContext.vacancyResponsibilities,
      jobTitle: vacancy.jobTitle || user.jobTitle,
    };

    toast.success("Process complete. Please review.");

    return generatedData;
  } catch (error) {
    toast.error("An error occurred during generation");
    throw error;
  } finally {
    toast.dismiss();
  }
};
