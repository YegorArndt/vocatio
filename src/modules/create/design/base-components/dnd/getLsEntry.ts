export const getLsEntry = (entryId: string, vacancyId: string) => {
  return localStorage.getItem(`${entryId}-${vacancyId}`);
};
