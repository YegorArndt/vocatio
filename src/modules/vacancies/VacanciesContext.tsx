import {
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import type { Vacancy } from "@prisma/client";

import { api } from "~/utils";

const { log } = console;

export type GroupedVacancies = Record<
  string,
  {
    vacancies: Vacancy[];
    label: string;
    icon?: string;
  }
>;

type VacanciesContextInput = {
  children: (props: VacanciesContextOutput) => ReactNode;
};

type VacanciesContextOutput = {
  groupedVacancies: GroupedVacancies;
  setGroupedVacancies: Dispatch<SetStateAction<GroupedVacancies>>;
  currentGroup: string;
  setCurrentGroup: (group: string) => void;
  loadingVacancies: boolean;
};

const Context = createContext({} as VacanciesContextOutput);

export const useVacanciesContext = () => {
  const context = useContext(Context);
  return context;
};

export const VacanciesContextProvider = ({
  children,
}: VacanciesContextInput) => {
  const { data: user, isLoading: loadingVacancies } = api.users.get.useQuery();

  const [groupedVacancies, setGroupedVacancies] = useState(
    {} as GroupedVacancies
  );
  const [currentGroup, setCurrentGroup] = useState("all");

  useEffect(() => {
    const hasAlreadyGrouped = !!groupedVacancies.all;
    if (!user || hasAlreadyGrouped) return;

    const v = user.vacancies;
    const initialized = groupVacancies(v);
    setGroupedVacancies(initialized);
  }, [user]);

  const value: VacanciesContextOutput = {
    groupedVacancies,
    setGroupedVacancies,
    currentGroup,
    setCurrentGroup,
    loadingVacancies,
  };

  return <Context.Provider value={value}>{children(value)}</Context.Provider>;
};

const groupVacancies = (vacancies: Vacancy[]): GroupedVacancies => {
  return vacancies.reduce(
    (grouped, vacancy) => {
      const groupKey = vacancy.group;

      if (!groupKey) return grouped;

      if (!grouped[groupKey]) {
        grouped[groupKey] = {
          vacancies: [],
          label: groupKey,
        };
      }

      grouped[groupKey]!.vacancies.push(vacancy);

      return grouped;
    },
    {
      all: {
        label: "All vacancies",
        vacancies,
        icon: "",
      },
    } as GroupedVacancies
  );
};
