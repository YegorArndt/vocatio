import type { Vacancy } from "@prisma/client";
import { toast } from "sonner";

import type { LsDraft } from "~/modules/draft/types";
import { Models, RouterUser } from "~/modules/extension/types";

export type PersistentData = {
  shouldAutoMoveToApplied: boolean;
  hasConnectedExtension: boolean;
  hasShownCongratsMessage: boolean;
  user: RouterUser | null;
  defaultModel: Models;
};

export const LS_KEY = "vocatio-preferences";
export const LS_UPDATE_EVENT = "vocatio-preferences-update";

export const initialPersistedState: PersistentData = {
  hasConnectedExtension: false,
  hasShownCongratsMessage: false,
  shouldAutoMoveToApplied: false,
  user: null,
  defaultModel: "gpt-3.5",
};

export const getPersistedState = (): PersistentData => {
  const data = JSON.parse(localStorage.getItem(LS_KEY) || "{}");
  return { ...initialPersistedState, ...data };
};

export const updatePersistedState = (
  cb: (d: PersistentData) => PersistentData
) => {
  const newData = cb(getPersistedState());
  localStorage.setItem(LS_KEY, JSON.stringify(newData));
  window.dispatchEvent(new Event(LS_UPDATE_EVENT));

  return newData;
};

export const getDraftByVacancyId = (vacancyId: Vacancy["id"]) => {
  try {
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
  } catch (e) {
    console.error(e);
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
      toast.error(
        "You've reached the beta limit. Contact the developer to resolve the issue.",
        {
          duration: 15000,
        }
      );

    return false;
  }
};
