import { assign, isNil } from "lodash-es";
import { v4 } from "uuid";

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
  if (!text) return "";
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

const dbUiModelMapping = {
  GPT3_5: "gpt-3.5",
  GPT4: "gpt-4",
};

export const getModel = (modelEnum: keyof typeof dbUiModelMapping) => {
  return dbUiModelMapping[modelEnum] || "gpt-3.5";
};

export const uuidv4 = () => v4();
