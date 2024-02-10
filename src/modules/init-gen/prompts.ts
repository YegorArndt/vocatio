import { PartialVacancy, RouterUser } from "../create/design/extension/types";

/**
 * Asks for:
 * 1) Tailored CV skills.
 * 2) Vacancy breakdown into: a) Responsibilities, b) Skills.
 */
export const buildSkillsPrompt = (
  lsUser: RouterUser,
  vacancy: PartialVacancy
) => {
  const skillNames = lsUser.skills.map((x) => x.name);

  // prettier-ignore
  return `Vacancy text: "${vacancy.description}".
      
     - Tasks:
     
     1. Create an array of the responsibilities the vacancy explicitly or implicitly states. They can probably be found here: "${vacancy.requiredSkills}".

     2. Create an array of skills (technologies, hard and soft skills, e.g. "React", "TypeScript") from the vacancy without categorization.
        Constraints: 1) anything you include in the output for this task must be in the vacancy text.
     
     3. Find skills from task 2 that match any of the following skills: ${skillNames.join(", ")}. 
        Constraints: 1) anything you include in the output for this task must be in the vacancy text.

     - Format of your response:

     You will return a JSON with the following structure:
      {
        "vacancyResponsibilities": string[] 
        "vacancySkills": string[],
        "generatedSkills": string[] 
      }

      Do not return anything but the JSON object.
  `;
};

/**
 * Asks for:
 * 1) Tailored experience at the first company.
 */
export const buildExperiencePrompt = (
  vacancy: PartialVacancy,
  bulletPointsToEnhance: string
) => {
  // prettier-ignore
  return `We will be tailoring my resume to a specific job posting. Here it is: "${vacancy.description}".
  
  We will do it in three steps:

  Step 1. Create an array of the responsibilities the vacancy explicitly or implicitly states. Usually they are found in "What you will do" or "Responsibilities" section of the job posting.
  
  Step 2. I'll give you the information about what I did at my first company. Here it is formatted as bullet points: "${bulletPointsToEnhance}".
  
      Map each bullet point to a requirement / responsibility that the bullet point relates to. Then create an array of tuples, where the first element is the responsibility a bullet point maps to and the second is the bullet point itself.

      Constraints for step 1:
      1) the final structure must be [tuple, tuple].
      2) the first element of each tuple must be a requirement / responsibility and the second element must be a bullet point.
       
  Step 3. For each tuple creatively merge its elements into an organic bullet point that reads naturally like a sentence and describes what I did. 
      Here’s where the creativity comes in. You need to merge these two elements into a single, cohesive bullet point. This bullet point should flow naturally, starting with the action or verb from the responsibility and seamlessly integrating the content of your bullet point. The aim is to craft a narrative that clearly demonstrates how your experience aligns with the specific responsibilities of the vacancy.
  
      Constraints for step 2:

      1) The final product should be an array of these merged bullet points, each formulated as a single, flowing sentence.
      2) Begin each bullet point with the responsibility (from tuple[0]) and end with your experience (from tuple[1]), crafting a narrative bridge between them.
      3) Highlight all hard skills by enclosing them in <span class="font-bold">{hard skill}</span> HTML tags for emphasis.
  
  - Format of your response:
  
    Return a single JSON that contains the all results of your work and has the following shape:
    
    {
      tuples: tuple[],
      mergedTuples: string[] <- must contain exactly the number of the bullet points I gave you in step 2.
    }
  
  - Constraints:
    1. Do not return anything but the JSON because I'll parse your response directly using JSON.parse().
    2. Each bullet point is a separate element of an array.
    3. Returning a JSON should not be considered a separate task. The JSON I'm asking for is the only thing you should return in principle.
  `;
};
