import { isNil } from "lodash-es";
import { type KeyboardEvent } from "react";
import { Inputs } from "~/types/utils";

const lsPath = (vacancyId: string, name: string) =>
  `draft-${name}-${vacancyId}`;

export const writeToLocalStorage = (
  vacancyId: string,
  name: string,
  value: string
) => {
  localStorage.setItem(lsPath(vacancyId, name), value);
};

export const readFromLocalStorage =
  (vacancyId: string) => (name: string, fallback?: string) => {
    const value = localStorage.getItem(lsPath(vacancyId, name));
    return isNil(value) ? fallback : value;
  };

const isMatchingPattern = (key: string, vacancyId: string) => {
  const pattern = `draft-`;
  return key.startsWith(pattern) && key.endsWith(`-${vacancyId}`);
};

export const restoreToDefaults = (vacancyId: string) => {
  for (let i = localStorage.length - 1; i >= 0; i--) {
    const key = localStorage.key(i);
    if (key && isMatchingPattern(key, vacancyId)) {
      localStorage.removeItem(key);
    }
  }
};

export const tabAutocomplete = (
  event: KeyboardEvent<Inputs>,
  vacancyId: string
) => {
  const { placeholder, name } = event.currentTarget;

  if (!placeholder) return;

  const isTabPressedAndFieldFocused =
    event.key === "Tab" && event.currentTarget === document.activeElement;

  if (isTabPressedAndFieldFocused) {
    event.preventDefault();
    event.currentTarget.value = placeholder;
    writeToLocalStorage(vacancyId, name, placeholder);
  }
};
