const LS_PREFIX = "experience-entry";

export const getExperienceEntryPath = (vacancyId: string, entryId: string) =>
  `${LS_PREFIX}-${vacancyId}-${entryId}`;
