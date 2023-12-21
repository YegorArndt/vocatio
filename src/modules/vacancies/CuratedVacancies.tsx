import Fuse from "fuse.js";
import { VacancyCard } from "./VacancyCard";
import { Vacancy } from "@prisma/client";
import { useFormContext } from "react-hook-form";

const { log } = console;

type SortableKeys = "createdAt" | "salaryMin";

const fuseKeys = [
  "companyName",
  "location",
  "country",
  "salaryMin",
  "salaryMax",
  "salaryCurrency",
  "requiredSeniority",
  "employmentType",
  "requiredLanguages",
  "requiredRemote",
  "sourceName",
  "age",
  "createdAt",
  "requiredSkills",
  "summary",
  "jobTitle",
];

const getSortingCriteria = (salaryOrder: string, dateOrder: string) => {
  const sortingCriteria: { key: SortableKeys; order: string }[] = [];

  if (salaryOrder)
    sortingCriteria.push({ key: "salaryMin", order: salaryOrder });

  if (dateOrder) sortingCriteria.push({ key: "createdAt", order: dateOrder });

  return sortingCriteria;
};

const sortVacancies = (
  vacancies: Vacancy[],
  sortingCriteria: { key: SortableKeys; order: string }[]
) => {
  if (sortingCriteria.length === 0) return vacancies;
  return [...vacancies].sort((a, b) => {
    for (const { key, order } of sortingCriteria) {
      if (a[key] !== b[key]) {
        return (order === "asc" ? 1 : -1) * (a[key]! < b[key]! ? -1 : 1);
      }
    }
    return 0;
  });
};

const filterVacancies = (
  vacancies: Vacancy[],
  filters: Record<string, unknown>
) => {
  const filterBy: string[] = [];

  Object.entries(filters).forEach(([key, value]) => {
    if (value === true) filterBy.push(key);
  });

  if (filterBy.length === 0) return vacancies;

  return vacancies.filter((v) => {
    return Object.values(v).some(
      (value) => typeof value === "string" && filterBy.includes(value)
    );
  });
};

export const CuratedVacancies = (props: { vacancies: Vacancy[] }) => {
  const { vacancies } = props;
  const { watch, getValues } = useFormContext();

  // const sortingCriteria = getSortingCriteria(watch("salary"), watch("date"));
  // const sortedVacancies = sortVacancies(vacancies, sortingCriteria);

  // const filters = forIn(omit(getValues(), ["salary", "date"]), (_, key) => ({
  //   [key]: watch(key),
  // }));
  // const filteredVacancies = filterVacancies(sortedVacancies, filters);

  const fuse = new Fuse(vacancies, {
    keys: fuseKeys,
    shouldSort: false,
  });

  return (
    vacancies
      // .search(watch("search") || "a")
      .map((vacancy) => <VacancyCard key={vacancy.id} vacancy={vacancy} />)
  );
};
