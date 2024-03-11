import { assign, get, isNil } from "lodash-es";
import { v4 } from "uuid";

import { DesignFont, fonts } from "./create/design/types";
import { iconsMap } from "./icons-map";

// todo: getFontCn
export const getFont = (font: DesignFont) => {
  const { font: f } = fonts[font];
  return get(f, "className", f);
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

export const stripHtmlTags = (text: string | undefined | null) => {
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

export const typedValues = <T extends object>(obj: T): T[keyof T][] => {
  return Object.values(obj) as T[keyof T][];
};

// type AiModels = Record<
//   DefaultModel,
//   { imageSrc: string; badge: string; name: string }
// >;

// export const aiModels: AiModels = {
//   [DefaultModel.GPT_4]: {
//     imageSrc: "/ai/gpt-4.png",
//     badge: "most capable",
//     name: "gpt-4",
//   },
//   [DefaultModel.GPT_3_5]: {
//     imageSrc: "/ai/gpt-3.png",
//     badge: "default",
//     name: "gpt-3.5",
//   },
// };

// export const getModelUi = (
//   modelEnum: keyof typeof aiModels | null | undefined
// ) => {
//   return aiModels[modelEnum || "GPT_3_5"];
// };

export const uuidv4 = () => v4();

export const getIcon = (inputString: string) => {
  const inputLower = inputString.toLowerCase();
  return (
    iconsMap.find(
      (iconEntry) =>
        (iconEntry.exact &&
          iconEntry.exact.some((e) => e.toLowerCase() === inputLower)) ||
        (iconEntry.partial &&
          iconEntry.partial.some((partial) =>
            inputLower?.includes(partial.toLowerCase())
          ))
    )?.icon || null
  );
};
