import { useEffect, useState } from "react";

import {
  type VocatioSettings,
  getSettings,
  initialSettings,
  updateSettings as staticUpdateSettings,
} from "~/modules/settings/settings";

const { log } = console;

export const useSettings = () => {
  const [settings, setSettings] = useState<VocatioSettings>(initialSettings);

  /**
   * Initialize settings from localStorage.
   */
  useEffect(() => {
    const state = getSettings();
    if (state) setSettings(state);
  }, []);

  /**
   * Update helper.
   */
  const updateSettings = (updated: Partial<VocatioSettings>) => {
    const newData = staticUpdateSettings((prev) => ({ ...prev, ...updated }));
    setSettings(newData);
  };

  return { settings, updateSettings } as const;
};
