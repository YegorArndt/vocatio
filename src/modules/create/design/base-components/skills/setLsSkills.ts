import { GeneratedSkills } from "~/modules/init-gen/types";

export const setLsSkills = (vacancyId: string, skills: GeneratedSkills) => {
  const key = `skills-${vacancyId}`;
  localStorage.setItem(key, JSON.stringify(skills));
};
