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

  const experience = formatExperience(user.experience);

  //prettier-ignore
  return `
  You are a highly creative resume writer professional with the task of customizing my resume for a specific job opening.
    Context:
      Vacancy: "${vacancy.description}".
      My professional summary: "${user.professionalSummary}".
      My employment histories: "${experience}".

    Instructions:
      1. Translate the professional summary and employment histories into the language in which the vacancy is written (Dutch, French, German, or Russian etc; if uncertain, use English).
      2. Compose a summary that presents my most relevant experiences and strong points/characteristics. Aim to use no more than 3-5 sentences.
      3. From the employment histories, extract 3 concise bullet points each, maximizing relevance to the vacancy. When possible, rephrase the bullet point to use exactly the same terminology as in the vacancy. 

    Format of your response:
      1. Prefix each employment history entry with an "@" followed by its index (zero-based). Do not prefix the summary.
      2. Keep the bullet point format for the employment histories. This is crucially important.
      3. Do not include anything but the summary and the employment histories. I will parse your response and include the texts directly into my resume.
      4. Keep <b> and <i> tags intact.
     `
};

export const tryMixtral = async (props: MixtralProps) => {
  const { vacancy, user } = props;
  const prompt = getPrompt({ vacancy, user });

  const tailored = await instruct(
    `<s>[INST] ${prompt} ${hfFormat}.[/INST]</s>`,
    {
      max_new_tokens,
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
