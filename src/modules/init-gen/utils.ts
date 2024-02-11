import { getDraftByVacancyId, setDraftByVacancyId } from "~/utils/ls";
import { buildExperiencePrompt, buildSkillsPrompt } from "./prompts";
import { applyGpt } from "~/server/api/utils/ai";
import { parseExperience, parseSkills } from "./parsers";
import { toast } from "sonner";
import { PartialVacancy, RouterUser, GeneratedDraft } from "./types";
import {
  EXPERIENCE_GENERATED_EVENT,
  SKILLS_GENERATED_EVENT,
} from "../constants";

type InitDraftProps = {
  vacancy: PartialVacancy;
  lsUser: RouterUser;
  handleExistingDraft: () => void;
  onComplete: (x: GeneratedDraft) => void;
};

export const initDraft = async (props: InitDraftProps) => {
  const { vacancy, lsUser, handleExistingDraft, onComplete } = props;

  if (getDraftByVacancyId(vacancy.id)) {
    handleExistingDraft();
    return;
  }

  const newDraft: GeneratedDraft = {
    generatedExperience: [],
    generatedProfessionalSummary: "",
    generatedSkills: [],
    vacancy,
    vacancyResponsibilities: [],
    vacancySkills: [],
    ...lsUser,
  };

  setDraftByVacancyId(vacancy.id, newDraft);
  const generatedDraft = await generateDraft(newDraft, lsUser);
  onComplete(generatedDraft as GeneratedDraft);
};

export const generateDraft = async (
  draft: GeneratedDraft,
  lsUser: RouterUser
) => {
  const { vacancy } = draft;
  toast.loading("Generating draft", { duration: Infinity });

  try {
    /**
     * Generate skills and experience with GPT-3.5
     */
    const [skills, experience] = await Promise.all([
      generateSkills(vacancy, lsUser),
      generateExperience(vacancy, lsUser),
    ]);

    const generatedExperience = processExperience(experience, lsUser, vacancy);
    document.dispatchEvent(
      new CustomEvent(EXPERIENCE_GENERATED_EVENT, {
        detail: generatedExperience,
      })
    );

    const generatedDraft: GeneratedDraft = {
      ...draft,
      ...skills,
      generatedExperience,
      vacancyResponsibilities: experience.vacancyResponsibilities,
      jobTitle: vacancy.jobTitle || lsUser.jobTitle,
    };

    setDraftByVacancyId(vacancy.id, generatedDraft);
    toast.success("Generation complete");

    return generatedDraft;
  } catch (error) {
    toast.error("An error occurred during draft generation");
    throw error;
  } finally {
    toast.dismiss();
  }
};

const processExperience = (
  enhancedExperience: { generatedExperience: string[] },
  lsUser: RouterUser,
  vacancy: PartialVacancy
) => {
  return lsUser.experience.map((x, i) => ({
    ...x,
    generatedDescription:
      i === 0
        ? /**
           * LLM sometimes includes the name of the company from the vacancy.
           * We need to replace it with the name of the company from the actual experience entry.
           */
          enhancedExperience.generatedExperience.map((g) =>
            g.replaceAll(vacancy.companyName!, x.place)
          )
        : toBulletPointArray(x.shadowDescription!),
  }));
};

const generateSkills = async (vacancy: PartialVacancy, lsUser: RouterUser) => {
  try {
    const skillsPrompt = buildSkillsPrompt(lsUser, vacancy);
    const skillsResponse = await applyGpt(skillsPrompt);
    const parsedSkills = parseSkills(skillsResponse);

    document.dispatchEvent(
      new CustomEvent(SKILLS_GENERATED_EVENT, { detail: parsedSkills })
    );
    return parsedSkills;
  } catch (error) {
    toast.error("Error generating skills");
    throw error;
  }
};

const generateExperience = async (
  vacancy: PartialVacancy,
  lsUser: RouterUser
) => {
  try {
    const experiencePrompt = buildExperiencePrompt(
      vacancy,
      getShadowOrDescription(lsUser)
    );
    const experienceResponse = await applyGpt(experiencePrompt);
    return parseExperience(experienceResponse);
  } catch (error) {
    toast.error("Error generating experience");
    throw error;
  }
};

const getShadowOrDescription = (lsUser: RouterUser) => {
  const { shadowDescription, description } = lsUser.experience[0] || {};
  return shadowDescription || description || "";
};

const toBulletPointArray = (shadowDescription: string) =>
  shadowDescription
    .split("• ")
    .slice(1)
    .map((point) => "• " + point.trim());
