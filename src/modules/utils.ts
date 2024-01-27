import { typedEntries } from "./draft/utils/common";
import { assign, isNil } from "lodash-es";

type ContactValueType = string | Date;

export const filterContactForClient = (contact?: Contact | null) => {
  if (!contact) return {};

  const irrelevantKeys = new Set([
    "id",
    "createdAt",
    "updatedAt",
    "user",
    "userId",
  ]);

  return typedEntries(contact)
    .filter(([key]) => !irrelevantKeys.has(key))
    .reduce(
      (obj: Partial<Record<keyof Contact, ContactValueType>>, [key, value]) => {
        obj[key] = value!;
        return obj;
      },
      {}
    );
};

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
