import type {
  PartialVacancy,
  RouterUser,
} from "~/modules/create/design/extension/types";
import { hfFormat, instruct } from "../ai";
import {
  formatExperience,
  formatResponse,
  mixWithOriginalHistories,
} from "./utils";

const { log } = console;

const max_new_tokens = 3000;

type MixtralProps = {
  vacancy: PartialVacancy;
  user: RouterUser;
};

const getPrompt = (props: MixtralProps) => {
  const { vacancy, user } = props;

  const experience = formatExperience(user.experience, vacancy.description!);

  //prettier-ignore
  return `
  Task: Resume tailoring to a specific vacancy.
  
  Context:

    Vacancy: "${vacancy.description}".
    Professional summary: "${user.professionalSummary}".
    Employment histories: "${experience}".

    Instructions:
    1. Make up completely new bullet points based on the vacancy description.
    2. For each employment history, replace their bullet points with the ones from step 1.
    3. Compose a completely new professional summary to present the cadidate as a perfect fit for the vacancy.
  
    Format of your response:
    1. First return the professional summary. Do not prefix the resultant summary with anything.
    2. Prefix each employment history entry with an "@" followed by its index (zero-based). 
    3. Wrap all skills desired in the vacancy (technologies, other hard-skills) with <b>{skill name}</b> html tag (e.g. <b>React</b>). Wrap them in the your entire response. 
    4. Do not add any introductory or accompanying text. I'll insert your response directly into the resume!
 `
};

export const tryMixtral = async (props: MixtralProps) => {
  const { vacancy, user } = props;
  const prompt = getPrompt({ vacancy, user });

  const tailored = await instruct(
    `<s>[INST] ${prompt} ${hfFormat}.[/INST]</s>`,
    {
      max_new_tokens,
      temperature: 0.7,
    }
  );

  const extracted = tailored.generated_text.split("</s>")[1];
  const formatted = formatResponse(extracted);
  const { summary, histories, isSuccessfullyEnhanced } = formatted;

  const experience = mixWithOriginalHistories({
    originalHistories: user.experience!,
    enhancedHistories: histories,
    vacancy,
  });

  return {
    professionalSummary: summary,
    experience,
    isSuccessfullyEnhanced,
  };
};
