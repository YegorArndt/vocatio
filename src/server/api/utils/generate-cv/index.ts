import type {
  Models,
  RouterUser,
  PartialVacancy,
} from "~/modules/create/design/extension/types";
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

  const tryFirstFn = model === "mixtral" ? tryMixtral : tryGpt;
  const fallbackFn = model === "mixtral" ? tryGpt : tryMixtral;

  let {
    professionalSummary,
    vacancySkills,
    matchingSkills,
    bonusTasks,
    vacancyResponsibilities,
    integratedGenericBulletPoints,
    isSuccess,
  } = await tryGpt({
    vacancy,
    user,
    model,
  });

  const combinedSummaries = {
    original: user.professionalSummary,
    generated: professionalSummary,
  };

  const tailoredExperience = [
    ...user.experience.map((x, i) =>
      i === 0
        ? {
            ...x,
            description: bonusTasks[0].mergedTuples
              .map((x) => `• ${x}`)
              .join("\n"),
          }
        : { ...x, description: x.shadowDescription }
    ),
  ];

  let filledMatchingSkills = matchingSkills;

  if (matchingSkills.length < 7) {
  }

  return {
    ...user,
    user,
    integratedGenericBulletPoints,
    combinedSummaries,
    vacancySkills,
    matchingSkills,
    tailoredExperience,
    jobTitle: vacancy.jobTitle || user.jobTitle || "Software Engineer",
    vacancy,
  };
};
