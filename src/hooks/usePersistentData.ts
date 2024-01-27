import { useEffect, useState } from "react";

import {
  getPersistedState,
  initialPersistedState,
  updatePersistedState,
  type PersistentData,
  LS_UPDATE_EVENT,
} from "~/utils/ls";

export const usePersistentData = () => {
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
  const updateLs = (nd: Partial<PersistentData>) => {
    const newData = updatePersistedState((d) => ({ ...d, ...nd }));
    setLs(newData);
  };

  return { ls, updateLs } as const;
};
