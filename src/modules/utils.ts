import { typedEntries } from "./draft/utils/common";
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
