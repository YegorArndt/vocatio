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

  const experience = formatExperience(user.experience);
  const responsibilities = getResponsibilities(vacancy, model);

  return `
  You are a resume writer with the task of customizing my resume for a specific job opening.
  Context:
    Vacancy: "${vacancy.description}".
    My professional summary: "${user.professionalSummary}".
    My employment histories: "${experience}".

    Instructions:
    1. Identify all required or "nice to have" skills in the vacancy.
    2. If the employment history ends with the phrase "Skills you might wanna include in the first bullet point" and provides a list of skills, analyze the list and find skill intersections with the skills from step 1. 
    3. Now let's focus the first bullet point of each individual employment history. This bullet point must always be at the top of its corresponding employment history and contain all (!!!) skill intersections from step 2.
    4. Wrap every single skill from step 2 with <b> tag. I will parse your response into HTML.
    5. Wrap metrics with <i> tag. Never wrap the entire bullet point. I will parse your response into HTML.
    6. Rewrite the employment histories into exactly 4 concise bullet points each. Maximize relevance to the vacancy for each bullet point. Each bullet point starts with a "•" and a verb. When possible, rephrase the bullet point to use exactly the same terminology as in the vacancy.
    7. When composing the summary, follow these rules: 
      5.1 First, use my most relevant experiences and strong points/characteristics.
      5.2 Second, have a short description to follow up.
      5.3 And thirdly, aim to use no more than 3-5 sentences.
    
  Format of your response:
    1. Prefix each employment history entry with an "@" followed by its index (zero-based). Do not prefix the summary.
    2. Maintain a first-person narrative style. Only for employment histories: do not use "I". Write in the past tense.
    3. Keep the bullet point format for the employment histories. This is crucially important.
    4. Translate the professional summary & employment histories into the language in which the key responsibilities are written (Dutch, French, German, Russian etc; if uncertain, use English).
    5. Return only the reworded professional summary and employment histories. Don't wrap them with quotation marks. I will use your response directly in the resume.
    6. Use fixed numbers for years of experience where necessary.
    7. Do not include the phrase "Skills you might wanna include in the first bullet point" in your response.
    `;
};

export const tryGpt = async (props: GptProps) => {
  const { vacancy, user, model } = props;

  const prompt = getPrompt({ vacancy, user, model });
  const result = await applyGpt(prompt, model);

  const { summary, histories, isSuccessfullyEnhanced } = formatResponse(
    result!
  );

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
    .map((x, i) => `@${i}: ${x.description}. Skills: ${x.skills.join(", ")}`)
    .join("\n")}\n
    - Goal: creating an impression of constant engagement with large-scale, high-traffic systems.  
    - For that: rewrite my employment histories into concise bullet points adding "driving $1B in revenue", "serve millions of license requests daily" and similar phrases contextually appropriate to the employment history.
    - In at least 1 bullet point per employment history come up with a metric that would illustrate the direct impact I made. 
    - Preferably, use seconds, money, number of users and similar metrics avoiding the usage of "%" sign.
    - Smaller numbers should be written as numbers (e.g. 1000). 
    - Each bullet point starts with a "•" and a verb.
    - As the first bullet of each employment history you should add a summary of what I did and include all the skills I have listed after each employment history in the bullet point.
    - Wrap skills with <b> tag, and metrics with <i>. I will parse your response into HTML.
    
    Constraints:
    - Do not add phrases like "driving $1B in revenue", "serve millions of license requests daily" to each bullet point. They must not come up consecutively.
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
