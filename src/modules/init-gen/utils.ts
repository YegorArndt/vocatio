import { getDraftByVacancyId, setDraftByVacancyId } from "~/utils/ls";
import { buildExperiencePrompt, buildSkillsPrompt } from "./prompts";
import { applyGpt } from "~/server/api/utils/ai";
import { parseExperience, parseSkills } from "./parsers";
import { toast } from "sonner";
import { GeneratedDraft } from "./types";
import { EXPERIENCE_GENERATED_EVENT, SKILLS_GENERATED_EVENT } from "../events";
import { PartialVacancy, RouterUser } from "../types";

type InitDraftProps = {
  vacancy: PartialVacancy;
  user: RouterUser;
  handleExistingDraft: () => void;
  onComplete: (x: GeneratedDraft) => void;
};

export const initDraft = async (props: InitDraftProps) => {
  const { vacancy, user, handleExistingDraft, onComplete } = props;

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
    ...user,
  };

  setDraftByVacancyId(vacancy.id, newDraft);
  const generatedDraft = await generateDraft(newDraft, user);
  onComplete(generatedDraft as GeneratedDraft);
};

export const generateDraft = async (
  draft: GeneratedDraft,
  user: RouterUser
) => {
  const { vacancy } = draft;
  toast.loading("Generating draft", { duration: Infinity });

  try {
    /**
     * Generate skills and experience with GPT-3.5
     */
    const [skills, experience] = await Promise.all([
      generateSkills(vacancy, user),
      generateExperience(vacancy, user),
    ]);

    const generatedExperience = processExperience(experience, user, vacancy);
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
      jobTitle: vacancy.jobTitle || user.jobTitle,
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
  user: RouterUser,
  vacancy: PartialVacancy
) => {
  return user.experience.map((x, i) => ({
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
        : toBulletPointArray(x.description!),
  }));
};

const generateSkills = async (vacancy: PartialVacancy, user: RouterUser) => {
  try {
    const skillsPrompt = buildSkillsPrompt(user, vacancy);
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

const getBulletPointsToEnhance = (user: RouterUser) => {
  const { enhancedDescription, description } = user.experience[0] || {};
  return enhancedDescription || description || "";
};

const toBulletPointArray = (enhancedDescription: string) =>
  enhancedDescription
    .split("• ")
    .slice(1)
    .map((point) => "• " + point.trim());
