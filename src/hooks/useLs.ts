import { useEffect, useState } from "react";

import {
  getPersistedState,
  initialPersistedState,
  updatePersistedState,
  type PersistentData,
  LS_UPDATE_EVENT,
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

  return { ls, updateLs } as const;
};
