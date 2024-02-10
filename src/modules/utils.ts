import { assign, isNil } from "lodash-es";

export const separateEntries = (obj: Record<string, unknown>) => {
  const definedEntries = {};
  const undefinedEntries = {};

  typedEntries(obj).forEach(([key, value]) => {
    if (isNil(value)) {
      assign(undefinedEntries, { [key]: value });
    } else {
      assign(definedEntries, { [key]: value });
    }
  });

  return { definedEntries, undefinedEntries };
};

export const stripHtmlTags = (text: string) => {
  return text.replace(/<[^>]*>?/gm, "");
};

export const typedKeys = <T extends object>(o: T): (keyof T)[] => {
  return Object.keys(o) as (keyof T)[];
};

export const typedEntries = <T extends object>(
  obj: T
): [keyof T, T[keyof T]][] => {
  return Object.entries(obj) as [keyof T, T[keyof T]][];
};
