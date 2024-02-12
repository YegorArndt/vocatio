// import {
//   PartialVacancy,
//   RouterUser,
//   Models,
// } from "~/modules/create/design/extension/types";
// import { applyGpt } from "../../server/api/utils/ai";
// import { formatExperience, getResponsibilities } from "./utils";
// import { AiGenerated } from "~/__archieved/draft/types";

// const { log } = console;

// type GptProps = {
//   vacancy: PartialVacancy;
//   user: RouterUser;
//   model: Models;
// };

// const getPrompt = (props: GptProps) => {
//   const { vacancy, user, model } = props;

//   /**
//    * "formatExperience" adds more intructions per experience entry.
//    */
//   const experience = formatExperience(user.experience, vacancy.description!);
//   const responsibilities = getResponsibilities(vacancy, model);

//   const combinedSkills = [
//     ...user.skills.map((x) => x.name),
//     ...user.experience.flatMap((x) => x.skills),
//   ];

//   const firstEmploymentHistoryBulletPoints =
//     user.experience[0]?.enhancedDescription;

//   // prettier-ignore
//   return `
//      Vacancy text: "${vacancy.description}".

//       - Tasks:

//       1. Give me a list of skills (technologies, hard and soft skills, e.g. "React", "TypeScript") from the vacancy.

//       2. Create an array of the responsibilities the vacancy explicitly or implicitly states. It must be an action instead of a single word.

//       3. Compose a perfect professional summary for the vacancy.

//       4. Integrate generic bullet points into one bullet point that coveys their total value. Generate six of them.

//       5. Find skills from step 1 that match any of the following skills: ${user.skills}. Conditions: 1) use only the names of the skills from step 1 in output.

//       Bonus tasks:

//       0*: Forget the context above for this task. Map a responsibility from step 2 to each of the following bullet points:

//       "${firstEmploymentHistoryBulletPoints}".

//       Create an array of tuples, where the first element is the responsibility a bullet point maps to and the second is the bullet point itself.
//       Conditions: 1) the final structure with the exception of the second condition, must be [tuple,tuple].

//       For each tuple creatively merge its elements into an organic bullet point (sentence that represents an accomplishment includable in the employment history) that flows naturally. Conditions: 1) each bullet point must be just one sentence, 2) each bullet point starts with tuple[0] element and ends with tuple[1] element effectively being something in between.

//       - Format of your response:

//       Return a single JSON that contains the all results of your work and has the following shape:

//       {
//         vacancySkills: string[],
//         vacancyResponsibilities: string[],
//         professionalSummary: string,
//         integratedGenericBulletPoints: string[] (6 elements expected),
//         matchingSkills: string[] (mustn't include anything that's not in the vacancySkills string[]),
//         bonusTasks: {
//           "0": {
//             tuples: tuple[],
//             mergedTuples: string[] <- each bullet point here must be just one sentence that starts with tuple[0] element and ends with tuple[1] element
//           }
//         }
//       }

//       - Constraints:
//       1. Do not return anything but the JSON because I'll parse your response directly using JSON.parse().
//       2. Each bullet point is a separate element of an array.
//       3. Returning a JSON should not be considered a separate task. The JSON I'm asking for is the only thing you should return in principle.
//       4. Inside the professionalSummary key as well as inside the mergedTuples key (from bonus tasks) you must wrap each occurrence of a relevant skill from the vacancy in <span class="font-bold"></span> html tag (example: with 5+ years of experience in <span class="font-bold">TypeScript</span>. A relevant skill is anything like technology ("React", "Node.js") or a responsibility. We do it to highlight what's relevant for the recruiter so that they don't lose their attention when first reading the CV.
//   `;
// };

// export const tryGpt = async (props: GptProps) => {
//   const { vacancy, user, model } = props;

//   const prompt = getPrompt({ vacancy, user, model });
//   const result = await applyGpt(prompt, model);

//   let obj = {} as AiGenerated;
//   let isSuccess = false;

//   try {
//     obj = JSON.parse(result!);
//     isSuccess = true;
//   } catch (error) {
//     console.error("Error parsing JSON:", error);
//   }

//   return { ...obj, isSuccess };
// };
