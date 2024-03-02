import { toast } from "sonner";
import { PartialVacancy, RouterUser } from "~/modules/types";
import { applyGpt } from "~/server/api/utils/ai";
import { Common } from "./types";
import { uuidv4 } from "~/modules/utils";
import { BulletPoint, CvExperienceEntry, Gen } from "~/modules/init-gen/types";
import { eventManager } from "~/modules/events/EventManager";
import { Events } from "~/modules/events/types";
import { CvContextManager } from "~/modules/CvContextManager";

export type ExperienceContext = Gen["experience"][0];

const getBulletPointsToEnhance = (user: RouterUser) => {
  const { description } = user.experience[0] || {};
  return description || "";
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
        5) ensure the sentence transitions smoothly from the responsibility to the detail of my experience.
        6) write in the first person singular and do not mention the name of the company.
  
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

const parseExperience = (gptResponse: string | undefined) => {
  let json = {} as {
    vacancyResponsibilities: string[];
    tuples: [string, string][];
    mergedTuples: string[];
  };

  try {
    if (!gptResponse) throw new Error("No response from AI");
    const parsed = JSON.parse(gptResponse);
    json = parsed;
  } catch (error) {}

  const renamed = {
    bullets: json?.mergedTuples
      ?.filter((x) => x.length > 5)
      .map((x) => ({
        id: `${uuidv4()}-bullet`,
        text: x,
      })),
    vacancyResponsibilities: json?.vacancyResponsibilities,
  };

  return renamed;
};

/**
 * TODO: Force bullet format for descriptions from the very beginning.
 */
export const bulletizeDescriptions = (
  user: RouterUser,
  key: "experience" | "education"
): CvExperienceEntry[] => {
  // @ts-ignore
  return user[key].map((x) => ({
    ...x,
    bullets: x.description
      .split("•")
      .slice(1)
      .map((point) => ({
        id: `${uuidv4()}-bullet`,
        text: point.trim(),
      })),
  }));
};

const swapFirstEntry = (
  entries: CvExperienceEntry[],
  bullets: BulletPoint[]
) => {
  const [first, ...rest] = entries;
  if (first?.bullets) first.bullets = bullets;

  return [first, ...rest] as CvExperienceEntry[];
};

export const tailorExperience = async (props: Common) => {
  const { vacancy, user } = props;

  try {
    const prompt = buildExperiencePrompt(vacancy, user);
    const gptResponse = await applyGpt(prompt);
    const parsedExperience = parseExperience(gptResponse);
    const entriesWithBullets = bulletizeDescriptions(user, "experience");
    const entriesWithSwappedFirst = swapFirstEntry(
      entriesWithBullets,
      parsedExperience.bullets || []
    );

    const result = {
      vacancyResponsibilities: parsedExperience.vacancyResponsibilities,
      experience: entriesWithSwappedFirst,
    };

    CvContextManager.getInstance().updateCv({ experience: result.experience });
    eventManager.emit<ExperienceContext>(Events.GEN_UPDATED);

    return result;
  } catch (error) {
    toast.error("Error generating experience");
    throw error;
  }
};
