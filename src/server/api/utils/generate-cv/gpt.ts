import { PartialVacancy, RouterUser, Models } from "~/modules/extension/types";
import { applyGpt } from "../ai";
import {
  formatExperience,
  formatResponse,
  getResponsibilities,
  mixWithOriginalHistories,
} from "./utils";

const { log } = console;

type GptProps = {
  vacancy: PartialVacancy;
  user: RouterUser;
  model: Models;
};

const getPrompt = (props: GptProps) => {
  const { vacancy, user, model } = props;

  /**
   * "formatExperience" adds more intructions per experience entry.
   */
  const experience = formatExperience(user.experience, vacancy.description!);
  const responsibilities = getResponsibilities(vacancy, model);

  // prettier-ignore
  return `
      Context:
  
        Vacancy: "${responsibilities}".
        My professional summary: "${user.professionalSummary}".
        My employment histories: "${experience}".

      Goal: compose a professional summary and rewrite my employment histories to closely match the vacancy description.

      Format of your response:
  
      1. Prefix each employment history entry with an "@" followed by its index (zero-based). Do not prefix the summary.
      2. Each employment history must keep its original 2-3 bullet points plus 2-3 made up bullet points based on vacancy description. A total of 4-6 bullet points is expected per employmnet history.
      3. Wrap all skills (technologies, other hard-skills) with <b>{skill name}</b> html tag (e.g. <b>React</b>). I'll parse your response into HTML.
      4. Do not add any introductory or accompanying text. I'll insert your response directly into the resume!
`;
};

export const tryGpt = async (props: GptProps) => {
  const { vacancy, user, model } = props;

  const prompt = getPrompt({ vacancy, user, model });
  const result = await applyGpt(prompt, model);

  const { summary, histories, isSuccessfullyEnhanced } = formatResponse(result);

  const experience = mixWithOriginalHistories({
    originalHistories: user.experience,
    enhancedHistories: histories,
    vacancy,
  });

  return {
    professionalSummary: summary || user.professionalSummary,
    experience,
    isSuccessfullyEnhanced,
  };
};

export const createShadowExperience = async (
  experience: RouterUser["experience"]
) => {
  if (experience.length === 0) return;

  const prompt = `${experience
    .map((x, i) => `@${i}: ${x.description}. [Skills: ${x.skills.join(", ")}]`)
    .join("\n")}\n
    - Goal: creating an impression of constant engagement with large-scale, high-traffic systems.  
    - For that: rewrite my employment histories into concise bullet points adding "driving $1B in revenue", "serve millions of license requests daily" and similar phrases contextually appropriate to the employment history.
    - Preferably, use seconds, money, number of users and similar metrics avoiding the usage of percentage based metrics.
    - Smaller numbers should be written as numbers (e.g. 1000). 
    - Each bullet point starts with a "•" and a verb.
    - As the first bullet of each employment history you should add a summary of what I did and include all the skills I have listed in square brackets after each employment history in the bullet point. Omit the square brackets. Use strong verbs and zero cliches. This is the most important bullet point.
    
    Constraints:
      - Do not add phrases like "driving $1B in revenue", "serve millions of license requests daily" to each bullet point. Instead add them to 1-2 bullet points per employment history.
      - Be more modest choosing numbers for metrics. 
      - Do not omit details from the employment histories. Simply change the format to bullet points.
  
    Format of your response:
      - Return the reworded histories as JSON with keys being the indices of the employment histories (initially prefixed with "@"). 
        Example: {"0": "reworded history" , "1": "reworded history" ...}
      - Do not return anything else but the reworded employment histories. I'll parse the JSON and include the histories directly into the resume.
  `;

  const result = await applyGpt(prompt, "gpt-4");

  let histories;
  try {
    histories = JSON.parse(result!);
  } catch (error) {
    console.error("Error parsing JSON:", error);
    // Handle the error appropriately
  }

  return histories;
};
