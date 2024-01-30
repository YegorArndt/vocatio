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

  return `
    Your task: rewrite my professional summary as well as the employment histories to completely match the vacancy requirements.

    Context:

      Vacancy requirements: "${responsibilities}".
      My professional summary: "${user.professionalSummary}".
      My employment histories: "${experience}".

    Format of your response:

      1. Prefix each employment history entry with an "@" followed by its index (zero-based). Do not prefix the summary.
      2. Each employment history must end up as a collection of 3-4 most relevant bullet points. Each bullet point must start with a "•" and a verb. Maintain first person narrative.
      3. Wrap all relevant skills with <b> html tag (e.g. <b>React</b>). I'll parse your response into HTML.
      4. Keep the <i/> tags intact.
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
    - As the first bullet of each employment history you should add a summary of what I did and include all the skills I have listed in square brackets after each employment history in the bullet point. Omit the square brackets.
    - Wrap the listing of skills in the first bullet point with square brackets. I need it, because I'll try to programatically find these skills later. Do not wrap each skills individually. Instead, wrap the whole listing of skills.
    
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
