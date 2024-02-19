import { DndProviderProps } from "./DndProvider";

export const setLsEntry = (
  entryId: string,
  vacancyId: string,
  data: DndProviderProps
) => {
  localStorage.setItem(`${entryId}-${vacancyId}`, JSON.stringify(data));
};
