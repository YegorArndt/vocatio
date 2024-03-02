import { Theme } from "~/hooks/useTheme";
import { PopoverEvents } from "../events/types";

export const fileNameSeparators = ["_", "-", " "] as const;

export type FileNameConfig = {
  myName: boolean;
  myJobTitle: boolean;
  vacancyJobTitle: boolean;
  companyName: boolean;
  date: boolean;
  separator: (typeof fileNameSeparators)[number];
};

const initialFileNameConfig: FileNameConfig = {
  myName: true,
  myJobTitle: false,
  vacancyJobTitle: true,
  companyName: true,
  date: true,
  separator: "_",
};

export type VocatioSettings = {
  shouldAutoApplied: boolean | null;
  hasConnectedExtension: boolean | null;
  hasShownCongratsMessage: boolean | null;
  modifiableItems: string[];
  hasHydrated: boolean | null;
  theme: Theme;
  fileNameConfig: FileNameConfig;
  [PopoverEvents.BOLDEN_SUMMARY]: boolean | null;
  [PopoverEvents.BOLDEN_BULLETS]: boolean | null;
  version: number;
};

export const LS_KEY = "vocatio-settings";

export const initialSettings: VocatioSettings = {
  hasHydrated: null,
  hasConnectedExtension: null,
  hasShownCongratsMessage: null,
  modifiableItems: [],
  shouldAutoApplied: null,
  theme: "dark",
  fileNameConfig: initialFileNameConfig,
  [PopoverEvents.BOLDEN_SUMMARY]: null,
  [PopoverEvents.BOLDEN_BULLETS]: null,
  version: 0,
};

export const getSettings = (): VocatioSettings => {
  const modifiedByUser = JSON.parse(localStorage.getItem(LS_KEY) || "{}");
  return { ...initialSettings, ...modifiedByUser };
};

export const updateSettings = (cb: (d: VocatioSettings) => VocatioSettings) => {
  const newData = cb(getSettings());
  localStorage.setItem(LS_KEY, JSON.stringify(newData));

  return newData;
};
