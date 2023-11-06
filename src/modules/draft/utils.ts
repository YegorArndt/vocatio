import { isNil } from "lodash-es";
import { type KeyboardEvent } from "react";
import type { LsComponent } from "./types";

const lsPath = (vacancyId: string, label: string) =>
  `draft-${label}-${vacancyId}`;

export const commit = (vacancyId: string) => (component: LsComponent) => {
  localStorage.setItem(
    lsPath(vacancyId, component.label),
    JSON.stringify(component)
  );
};

export const readFromLocalStorage = (
  vacancyId: string,
  label: string,
  fallback?: LsComponent
) => {
  const component = localStorage.getItem(lsPath(vacancyId, label));
  return isNil(component) ? fallback : JSON.parse(component);
};

export const tabAutocomplete = (
  event: KeyboardEvent<HTMLInputElement>,
  component: LsComponent,
  vacancyId: string
) => {
  const { placeholder } = event.currentTarget;

  if (!placeholder) return;

  const isTabPressedAndFieldFocused =
    event.key === "Tab" && event.currentTarget === document.activeElement;

  if (isTabPressedAndFieldFocused) {
    event.preventDefault();
    commit(vacancyId)({ ...component, value: placeholder });
  }
};
