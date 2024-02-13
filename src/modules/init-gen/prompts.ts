import { RouterUser, PartialVacancy } from "../types";

const getBulletPointsToEnhance = (user: RouterUser) => {
  const { enhancedDescription, description } = user.experience[0] || {};
  return enhancedDescription || description || "";
};

export const buildSkillsPrompt = (
  lsUser: RouterUser,
  vacancy: PartialVacancy
) => {
  const skillNames = lsUser.skills.map((x) => x.name);

  // prettier-ignore
  return `Vacancy text: "${vacancy.description}".
      
     - Tasks:
     
     1. Create an array of skills (technologies, and other hard skills, e.g. "React", "TypeScript", "debugging") from the vacancy without categorization.
        Conditions: 
        1) anything you include in the output for this task must be in the vacancy text.
     
     2. Find skills from task 1 that match any of the following skills: ${skillNames.join(", ")}. 
        Conditions for task 2: 
        1) anything you include in the output for this task must be in the vacancy text.

     3. Create a professional summary to present me as a perfect fit for the vacancy. I will include it in the top of my resume. 
        Conditions for task 3: 
        1) do not mention anything about education in the summary.
        2) omit personal pronouns, filler words and colloquial language from the summary to maintain a professional tone. "I" has no place in the summary.
        3) wrap all hard skills from task 1 in <span class="font-bold">{hard skill}</span> HTML tags for emphasis in the professional summary. I'll parse in the HTML tags later.
        4) the summary must be concise, emphasizing the most relevant skills and experience for the vacancy.
 
     - Format of your response:

     You will return a JSON with the following structure:
      {
        "vacancySkills": string[],
        "generatedSkills": string[], <- Remember: the skills inside this array must be a subset of the skills in the vacancy text
        "professionalSummary": string <- enclose all technologies and other hard skills in <span class="font-bold">{hard skill}</span> HTML tags for emphasis.
      }

      Do not return anything but the JSON object.
  `;
};

export const buildExperiencePrompt = (
  vacancy: PartialVacancy,
  user: RouterUser
) => {
  const bulletPointsToEnhance = getBulletPointsToEnhance(user);

  // prettier-ignore
  return `We will be tailoring my resume to a specific job posting. Here it is: "${vacancy.description}".
  
  We will do it in three steps:

  Step 1. Create an array of the responsibilities the vacancy explicitly or implicitly states. Usually they are found in "What you will do" or "Responsibilities" section of the job posting. Each responsibility must be an active verb or a verb phrase. Here's an example: ["Develop new features", "Write clean, maintainable code"].
  
  Step 2. I'll give you the information about what I did at my first company. Here it is formatted as bullet points: "${bulletPointsToEnhance}".
  
      Map each bullet point to a responsibility that the bullet point covers or relates to. Then create an array of tuples, where the first element is the responsibility a bullet point maps to and the second is the bullet point itself.

      Constraints for step 2:
      1) the final structure must be [tuple, tuple].
      2) the first element of each tuple must be a responsibility and the second element must be a bullet point.

  Step 3. Creatively merge the elements of each tuple into an organic bullet point that flows naturally. 
    
      Constraints for step 3:
      1) each bullet point must be just one concise sentence.
      2) each bullet point starts with tuple[0] element and ends with tuple[1] element effectively being something in between.
      3) each bullet point starts with the main verb of the responsibility in the past simple tense.
      4) highlight all hard skills by enclosing them in <span class="font-bold">{hard skill}</span> HTML tags for emphasis.

      Remember: the aim is to craft a narrative that clearly demonstrates how my experience aligns with the specific responsibilities of the vacancy by merging the responsibility and the bullet point into a single, cohesive bullet point.
  
  - Format of your response:
  
    Return a single JSON that contains the all results of your work and has the following shape:
    
    {
      vacancyResponsibilities: string[],
      tuples: tuple[],
      mergedTuples: string[] <- must contain exactly the number of the bullet points I gave you in step 2. Must be an array of strings where each string is a bullet point.
    }
  
  - Constraints:
    1. Do not return anything but the JSON because I'll parse your response directly using JSON.parse().
    2. Each bullet point is a separate element of an array.
    3. Returning a JSON should not be considered a separate task. The JSON I'm asking for is the only thing you should return in principle.
  `;
};

// Step 3. For each tuple creatively mcerge its elements into an organic bullet point that reads naturally like a sentence and describes what I did.
// Here’s where the creativity comes in. You need to merge these two elements into a single, cohesive bullet point. This bullet point should flow naturally, starting with the action or verb from the responsibility and seamlessly integrating the content of its related bullet point. The aim is to craft a narrative that clearly demonstrates how my experience aligns with the specific responsibilities of the vacancy.
