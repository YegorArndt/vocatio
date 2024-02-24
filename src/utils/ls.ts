import { toast } from "sonner";
import { Theme } from "~/hooks/useTheme";
import { Events, eventManager } from "~/modules/EventManager";
import { GeneratedData } from "~/modules/init-gen/types";

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

export type PersistentData = {
  shouldAutoApplied: boolean | null;
  hasConnectedExtension: boolean | null;
  hasShownCongratsMessage: boolean | null;
  modifiableItems: string[];
  hasHydrated: boolean | null;
  enableDefaultIcon: boolean | null;
  theme: Theme;
  isLoaded: boolean;
  spellCheck: boolean | null;
  fileNameConfig: FileNameConfig;
};

export const LS_KEY = "vocatio-settings";
export const LS_UPDATE_EVENT = "vocatio-settings-update";

export const initialPersistedState: PersistentData = {
  hasConnectedExtension: null,
  hasShownCongratsMessage: null,
  shouldAutoApplied: null,
  modifiableItems: [],
  hasHydrated: null,
  enableDefaultIcon: null,
  theme: "dark",
  isLoaded: true,
  spellCheck: null,
  fileNameConfig: initialFileNameConfig,
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

export const getLsGeneratedData = (vacancyId?: string) => {
  if (!vacancyId) return;

  try {
    if (!localStorage) return;

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key === `gen-${vacancyId}`) {
        const value = localStorage.getItem(key);

        if (value) {
          return JSON.parse(value) as GeneratedData;
        }
      }
    }
  } catch (e) {
    console.error(e);
  }
};

export const setLsGeneratedData = (gen: GeneratedData) => {
  if (!localStorage) return;

  try {
    localStorage.setItem(`gen-${gen.vacancy.id}`, JSON.stringify(gen));
    eventManager.emit(Events.GENERATED_DATA_UPDATED, gen);
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
