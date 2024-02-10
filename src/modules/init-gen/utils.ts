import { getDraftByVacancyId, setDraftByVacancyId } from "~/utils/ls";
import type {
  PartialVacancy,
  RouterUser,
} from "../create/design/extension/types";
import { GeneratedDraft } from "../create/design/types";
import { buildExperiencePrompt, buildSkillsPrompt } from "./prompts";
import { applyGpt } from "~/server/api/utils/ai";
import { parseExperience, parseSkills } from "./parsers";
import { toast } from "sonner";
import { EXPERIENCE_READY_EVENT, SKILLS_READY_EVENT } from "./constants";

type InitDraftProps = {
  vacancy: PartialVacancy;
  lsUser: RouterUser;
  handleExistingDraft: () => void;
  onComplete: (x: GeneratedDraft) => void;
};

export const initDraft = async (props: InitDraftProps) => {
  const { vacancy, lsUser, handleExistingDraft, onComplete } = props;

  const isExistingDraft = !!getDraftByVacancyId(vacancy.id);

  if (isExistingDraft) {
    handleExistingDraft();
    return;
  }

  /**
   * Done to prevent restarting the generation process.
   */
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

  onComplete(generatedDraft);
};

export const handleSkills = async (
  vacancy: PartialVacancy,
  lsUser: RouterUser
) => {
  const skillsPrompt = buildSkillsPrompt(lsUser, vacancy);
  const skillsPromptReturn = await applyGpt(skillsPrompt);
  const parsed = parseSkills(skillsPromptReturn);

  return parsed;
};

export const handleExperience = async (
  vacancy: PartialVacancy,
  lsUser: RouterUser
) => {
  const { shadowDescription, description } = lsUser.experience[0] || {};

  /**
   * Get prompt.
   */
  const experiencePrompt = buildExperiencePrompt(
    vacancy,
    shadowDescription || description || ""
  );
  /**
   * Apply GPT.
   */
  const experiencePromptReturn = await applyGpt(experiencePrompt);
  /**
   * Parse GPT response.
   */
  const parsed = parseExperience(experiencePromptReturn);

  return parsed;
};

const toBulletPointArray = (shadowDescription: string) =>
  shadowDescription
    .split("• ")
    .slice(1)
    .map((point) => "• " + point.trim());

export const generateDraft = async (
  draft: GeneratedDraft,
  lsUser: RouterUser
) => {
  const { vacancy } = draft;

  /**
   * Handle skills.
   */
  toast.loading("Generating skills", {
    duration: Infinity,
  });
  const enhancedSkills = await handleSkills(vacancy, lsUser);
  document.dispatchEvent(
    new CustomEvent(SKILLS_READY_EVENT, { detail: enhancedSkills })
  );
  toast.dismiss();

  /**
   * Handle experience.
   */
  toast.loading("Generating experience", {
    duration: Infinity,
    description: "Takes up to 30 seconds.",
  });
  const enhancedExperience = await handleExperience(vacancy, lsUser);

  const generatedExperience = lsUser.experience.map((x, i) => ({
    ...x,
    generatedDescription:
      i === 0
        ? enhancedExperience.generatedExperience
        : toBulletPointArray(x.shadowDescription!),
  }));

  document.dispatchEvent(
    new CustomEvent(EXPERIENCE_READY_EVENT, { detail: generatedExperience })
  );
  toast.dismiss();
  toast.success("Generation complete");

  const generatedDraft = {
    ...draft,
    generatedExperience,
    ...enhancedSkills,
    jobTitle: vacancy.jobTitle ?? lsUser.jobTitle,
  };

  setDraftByVacancyId(vacancy.id, generatedDraft);

  return generatedDraft;
};
