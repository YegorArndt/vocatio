import { RouterUser } from "~/modules/types";
import { typedKeys } from "~/modules/utils";

export const buildEnhanceDescriptionPrompt = (
  experience: RouterUser["experience"]
) => {
  return `My experience entries: ${experience
    .map((x, i) => `@${i}: ${x.description}. [Skills: ${x.skills.join(", ")}]`)
    .join("\n")}\n
      
      Each separate experience entry is prefixed with "@" follow by its index. So we have a total of ${
        experience.length
      } experience entries.
      
      We will improve these experience entries by adhering to best resume writing practices in 3 steps.
      
      Step 1. Rewrite each experience entry into concise bullet points. 
      Conditions for this step: 1) each bullet point starts with a "•" and a verb in past simple, 2) omit personal pronouns, filler words and colloquial language from the summary to maintain a professional tone, 3) compose the bullet point the way the best resumes for FAANG companies are composed.
      
      Step 2. Using the output from step 1, focus on the first bullet point of each (@{index} is considered a start of a new experience entry) experience entry. In the first bullet point, write a summary of the respective experience entry mentioning as many skills as possible. Keep the remanining bullet points as is.
      
      Step 3. Using the output from step 2, create an impression of constant engagement with large-scale, high-traffic systems by  adding phrases like "driving $1B in revenue", "serve millions of license requests daily" and similar phrases contextually appropriate to the experience entry / bullet point. Come up with more phrases on your own.
      Conditions for this step: 
      1) preferably, use money and time metrics, avoiding the usage of percentage based metrics - though not entirely, 
      2) smaller numbers should be written as numbers (e.g. 1000), 
      3) the number of bullet points in the output for this step must be the exact number of bullet points you came up during first step.
      
      As a starting point for each step use the respective experience entry from the previous step.
      
      Format of your response:
      - Return the experience entries as JSON with keys being the indices of the experience entries (initially prefixed with "@"). I'm only interested in receiving the results of the third step. Perform all the steps in your memory, but return the third one for each experience entry.
      Example: { "0": { "step3": ... } }
      - Do not return anything else but the reworded experience entries. I'll parse the JSON and include the histories directly into the resume.
    `;
};

type ParsedJson = {
  [key: string]: { step3: string };
};

const format = (parsedJson: ParsedJson) => {
  return typedKeys(parsedJson).reduce((acc, key) => {
    return { ...acc, [key]: parsedJson[key]!.step3 };
  }, {} as { [key: string]: string });
};

export const parseEnhancedDescription = (
  descriptionPromptReturn: string | undefined
) => {
  let parsedJson = {} as {
    [key: string]: { step3: string };
  };
  let formatted = {} as {
    [key: string]: string;
  };

  try {
    parsedJson = JSON.parse(descriptionPromptReturn!);
    formatted = format(parsedJson);
  } catch (error) {}

  return formatted;
};
