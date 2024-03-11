import type { RouterUser, PartialVacancy } from "~/modules/types";
import { uuidv4 } from "~/modules/utils";
import { Common } from "./types";
import { toast } from "sonner";
import { eventManager } from "~/modules/events/EventManager";
import { applyGpt } from "~/server/api/utils/ai";
import { Events } from "~/modules/events/types";
import { Gen } from "~/modules/init-gen/types";
import { CvContextManager } from "~/modules/CvContextManager";

const { log } = console;

export type SkillsContext = Pick<
  Gen,
  "vacancySkills" | "skills" | "professionalSummary"
>;

const buildSkillsPrompt = (user: RouterUser, vacancy: PartialVacancy) => {
  const skillNames = user.skills.map((x) => x.name);

  // prettier-ignore
  return `Vacancy text: "${vacancy.description}".
        
       - Tasks:
       
       1. Create an array of skills (technologies, and other hard skills, e.g. "React", "TypeScript", "debugging") from the vacancy without categorization.
          Conditions: 
          1) anything you include in the output for this task must be in the vacancy text.
          2) make sure that what you include is an actual skill.
       
       2. Find skills from task 1 that match any of the following skills: ${skillNames.join(", ")}. 
          Conditions for task 2: 
          1) anything you include in the output for this task must be in the vacancy text.
  
       3. Create a professional summary of the ideal candidate for the job. I will include it in the top of my resume. 
          Conditions for task 3: 
          1) do not mention anything about education in the summary.
          2) omit personal pronouns, filler words and colloquial language from the summary to maintain a professional tone. "I" has no place in the summary.
          3) wrap all hard skills from task 1 in <span class="font-bold">{hard skill}</span> HTML tags for emphasis in the professional summary. I'll parse in the HTML tags later.
          4) make sure the summary comprises at least 3 sentences, and max. 5 sentences.

      4. Also identify:
          1) Salary they pay.
          2) Location of the job.
          3) Job setting (remote, hybrid, on-site).
          4) Required seniority level (junior, mid, senior, lead, etc).
          5) Required format (full-time, part-time, contract, etc).
        Conditions for task 4: 1) if not specified, simply output "". 
   
       - Format of your response:
  
       You will return a JSON with the following structure:
        {
          "vacancySkills": string[],
          "generatedSkills": string[], <- Remember: the skills inside this array must be a subset of the skills in the vacancy text
          "professionalSummary": string <- enclose all technologies and other hard skills in <span class="font-bold">{hard skill}</span> HTML tags for emphasis.
          "salary": string, 
          "location": string,
          "jobSetting": string,
          "seniority": string,
          "format": string
        }
  
        Do not return anything but the JSON object.
    `;
};

export const formatSkills = (skills: string[]) =>
  skills.map((x) => ({ id: uuidv4(), name: x }));

export const parseSkills = (gptResponse: string | undefined) => {
  let vacancySkills = [] as Gen["vacancySkills"];
  let skills = [] as Gen["skills"];
  let professionalSummary = "";
  let salary = "";
  let location = "";
  let requiredRemote = "";
  let requiredSeniority = "";
  let employmentType = "";

  try {
    if (!gptResponse) throw new Error("No response from AI");

    const {
      vacancySkills: vacancy_skills,
      generatedSkills: generated_skills,
      professionalSummary: professional_summary,
      salary: salary_,
      location: location_,
      jobSetting: job_setting,
      seniority: seniority_,
      format: format_,
    } = JSON.parse(gptResponse);

    vacancySkills = vacancy_skills;
    skills = formatSkills(generated_skills);
    professionalSummary = professional_summary;
    salary = salary_;
    location = location_;
    requiredRemote = job_setting;
    requiredSeniority = seniority_;
    employmentType = format_;
  } catch (error) {
    console.error(JSON.stringify(error, null, 2));
  }

  return {
    vacancySkills,
    skills,
    professionalSummary,
    salary,
    location,
    requiredRemote,
    requiredSeniority,
    employmentType,
  };
};

export const tailorSkills = async (props: Common) => {
  const { user, vacancy } = props;

  try {
    const prompt = buildSkillsPrompt(user, vacancy);
    const gptResponse = await applyGpt(prompt);
    const parsed = parseSkills(gptResponse);

    const instance = CvContextManager.getInstance();

    instance.updateGen({
      location: parsed.location,
      requiredRemote: parsed.requiredRemote,
      requiredSeniority: parsed.requiredSeniority,
      employmentType: parsed.employmentType,
      salary: parsed.salary,
    });
    instance.updateCv({
      skills: parsed.skills,
      summary: parsed.professionalSummary,
    });

    eventManager.emit(Events.GEN_UPDATED);

    return parsed;
  } catch (error) {
    toast.error("Error generating skills");
    throw error;
  }
};
