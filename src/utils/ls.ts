import type { Vacancy } from "@prisma/client";
import { toast } from "sonner";

import type { LsDraft } from "~/modules/draft/types";

export type LsNotification = {
  title: string;
  type: "success" | "error" | "warning" | "info";
  body?: string;
  link?: string;
};

export type PersistantData = {
  isDndMode: boolean;
  notifications: LsNotification[];
};

export const LS_KEY = "vocatio-preferences";
// export const LS_UPDATE_EVENT = "ls-update";
export const initialPersistedState: PersistantData = {
  isDndMode: false,
  notifications: [],
};

export const getPersistedState = (): PersistantData => {
  const data = JSON.parse(localStorage.getItem(LS_KEY) || "{}");
  return { ...initialPersistedState, ...data };
};

export const updatePersistedState = (
  cb: (d: PersistantData) => PersistantData
) => {
  const newData = cb(getPersistedState());
  localStorage.setItem(LS_KEY, JSON.stringify(newData));

  return newData;
};

export const getDraftByVacancyId = (vacancyId: Vacancy["id"]) => {
  if (!localStorage) return;

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key === `draft-${vacancyId}`) {
      const value = localStorage.getItem(key);

      if (value) {
        return JSON.parse(value) as LsDraft;
      }
    }
  }
};

export const deleteDraftByVacancyId = (vacancyId: Vacancy["id"]) => {
  if (!localStorage) return;

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key === `draft-${vacancyId}`) {
      localStorage.get(key);
    }
  }
};

export const setDraftByVacancyId = (
  vacancyId: Vacancy["id"],
  draft: LsDraft
) => {
  if (!localStorage) return;

  try {
    localStorage.setItem(`draft-${vacancyId}`, JSON.stringify(draft));
    return true;
  } catch (e) {
    const isLsQuotaExceededError =
      e instanceof DOMException && e.name === "QuotaExceededError";

    if (isLsQuotaExceededError)
      toast.error("Clear the local storage to save more CVs.", {
        duration: 10000,
      });

    return false;
  }
};
