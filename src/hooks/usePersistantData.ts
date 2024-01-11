import { useEffect, useState } from "react";

import {
  getPersistedState,
  initialPersistedState,
  updatePersistedState,
  type PersistantData,
} from "~/utils/ls";

export const usePersistantData = () => {
  const [ls, setLs] = useState<PersistantData>(initialPersistedState);

  /**
   * Initialize state from localStorage.
   */
  useEffect(() => {
    const state = getPersistedState();
    if (state) setLs(state);
  }, []);

  /**
   * Utils.
   */

  /**
   * Update helper.
   */
  const updateData = (nd: Partial<PersistantData>) => {
    const newData = updatePersistedState((d) => ({ ...d, ...nd }));
    setLs(newData);
  };

  return { ls, updateData } as const;
};
