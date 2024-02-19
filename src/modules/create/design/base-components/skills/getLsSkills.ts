import { GeneratedSkills } from "~/modules/init-gen/types";

export const getLsSkills = (vacancyId: string) => {
  const key = `skills-${vacancyId}`;
  const data = localStorage.getItem(key);

  if (!data) return [];

  return JSON.parse(data) as GeneratedSkills;
};
