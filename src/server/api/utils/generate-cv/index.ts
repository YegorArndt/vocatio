import { v4 as uuidv4 } from "uuid";

import type {
  Models,
  RouterUser,
  PartialVacancy,
} from "~/modules/extension/types";
import { getTopSkills } from "./utils";
import { tryMixtral } from "./mixtral";
import { tryGpt } from "./gpt";

const { log } = console;

type GenerateDraftProps = {
  vacancy: PartialVacancy;
  user: RouterUser;
  model: Models;
};

export const generateDraft = async (props: GenerateDraftProps) => {
  const { vacancy, user, model } = props;

  const firstTryModel = model === "mixtral" ? tryMixtral : tryGpt;
  const fallbackModel = model === "mixtral" ? tryGpt : tryMixtral;

  let { professionalSummary, experience, isSuccessfullyEnhanced } =
    await firstTryModel({
      vacancy,
      user,
      model,
    });

  if (!isSuccessfullyEnhanced) {
    ({ professionalSummary, experience } = await fallbackModel({
      vacancy,
      user,
      model,
    }));
  }

  const topSkills = getTopSkills(vacancy, user);

  return {
    ...user,
    professionalSummary: professionalSummary || user.professionalSummary,
    experience:
      experience ||
      user.experience!.map((x) => ({
        ...x,
        id: uuidv4(),
        originalExperienceEntryId: x.id,
      })),
    jobTitle: vacancy.jobTitle || user.jobTitle || "Software Engineer",
    topSkills,
    vacancy,
  };
};
