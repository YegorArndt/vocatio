import type { Vacancy } from "@prisma/client";
import { vacancyUI } from "./constants";

type Item = {
  text?: string;
  icon: JSX.Element | undefined;
  value: string | number | Date | null;
};

export type Falsy<T> = T | null | undefined;

const getSalaryRange = (
  min: Falsy<number>,
  max: Falsy<number>,
  isAnnualSalary: boolean
) => {
  const isValid = min && max;
  if (!isValid) return null;

  const salary = min === max ? min : `${min} - ${max}`;
  const salaryType = isAnnualSalary ? "annually" : "monthly";

  return `${salary} ${salaryType}`;
};

export const breakDown = (vacancy: Vacancy) => {
  const {
    companyName,
    salaryMax,
    salaryMin,
    age,
    createdAt,
    jobTitle,
    sourceName,
    sourceUrl,
    id,
    userId,
    professionField,
    updatedAt,
    image,
    requiredSkills,
    description,
    isAnnualSalary,
    ...relevant
  } = vacancy;

  const header = {
    companyName,
    jobTitle,
    age,
    createdAt,
    sourceUrl,
    sourceName,
    image,
  };

  const available: Item[] = [];
  const unavailable: Item[] = [];

  const salary = getSalaryRange(salaryMin, salaryMax, isAnnualSalary);
  const salaryUi = vacancyUI.salary;
  const salaryArray = salary ? available : unavailable;
  salaryArray.push({ ...salaryUi, value: salary });

  Object.entries(relevant).forEach(([key, value]) => {
    const array = value ? available : unavailable;
    const ui = vacancyUI[key as keyof typeof vacancyUI];
    array.push({ ...ui, value });
  });

  return {
    header,
    available,
    unavailable,
  };
};
