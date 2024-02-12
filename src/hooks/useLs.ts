import { useEffect, useState } from "react";
import { GeneratedDraft } from "~/modules/init-gen/types";

import {
  getPersistedState,
  initialPersistedState,
  updatePersistedState,
  type PersistentData,
  LS_UPDATE_EVENT,
  getDraftByVacancyId,
  setDraftByVacancyId,
} from "~/utils/ls";

const { log } = console;

export const useLs = () => {
  const [ls, setLs] = useState<PersistentData>(initialPersistedState);

  /**
   * Initialize state from localStorage.
   */
  useEffect(() => {
    const state = getPersistedState();
    if (state) setLs(state);

    window.addEventListener(LS_UPDATE_EVENT, () => {
      const state = getPersistedState();
      if (state) setLs(state);
    });
  }, []);

  /**
   * Utils.
   */

  /**
   * Update helper.
   */
  const updateLs = (updated: Partial<PersistentData>) => {
    const newData = updatePersistedState((prev) => ({ ...prev, ...updated }));
    setLs(newData);
  };

  const updateDraft = (updated: Partial<GeneratedDraft>, vacancyId: string) => {
    const target = getDraftByVacancyId(vacancyId);
    if (!target) return;

    const newData = { ...target, ...updated };

    setDraftByVacancyId(vacancyId, newData);
  };

  return { ls, updateLs, updateDraft } as const;
};
