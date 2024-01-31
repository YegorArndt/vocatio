import type { PartialVacancy, RouterUser } from "~/modules/extension/types";
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
  Context:

    Vacancy: "${vacancy.description}".
    My professional summary: "${user.professionalSummary}".
    My employment histories: "${experience}".

    Instructions:
    1. Completely rewrite the professional summary (from scratch, create a new one) to very closely match the vacancy.
    2. Completely rewrite the employment histories (from scratch, create new ones) to very closely match the vacancy. For that, make up new bullet points based on what's required in the vacancy. You can consider mixing them with the original ones. The made up ones are more important though.
    3. Keep each employment history entry at max. 4 bullet points ("•").

    Format of your response:
    1. First return the professional summary. Do not prefix the resultant summary with anything.
    2. Prefix each employment history entry with an "@" followed by its index (zero-based). 
    3. Wrap all skills (technologies, other hard-skills) with <b>{skill name}</b> html tag (e.g. <b>React</b>). I'll parse your response into HTML.
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
