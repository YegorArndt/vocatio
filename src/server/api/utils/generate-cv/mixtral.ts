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
  Your task: rewrite my professional summary as well as the employment histories to completely (!) match the vacancy requirements. Wrap the key required skills (e.g. "React") with <b>React</b> html tag. I'll parse your response into HTML.

  Context:

    Vacancy requirements: "${vacancy.requiredSkills}".
    My professional summary: "${user.professionalSummary}".
    My employment histories: "${experience}".

  Format of your response:

    1. Prefix each employment history entry with an "@" followed by its index (zero-based). Do not prefix the summary.
    2. Each employment history must end up as a collection of 3-4 most relevant bullet points. Each bullet point must start with a "•" and a verb. Maintain first person narrative. If there's lack of relevance in the original bullet points, just create a new one mirroring the vacancy requirements.
    3. Wrap all relevant skills with <b> html tag (e.g. <b>React</b>). I'll parse your response into HTML.
    4. Keep the <i/> tags intact.
    5. Return the summary before the histories.
    6. Make the summary short, concise. It must be a single sentence.
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

  log(tailored);

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
