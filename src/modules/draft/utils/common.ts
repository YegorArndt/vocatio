import type { TypeOfComponent } from "../types/components";

export const typedKeys = <T extends object>(o: T): (keyof T)[] => {
  return Object.keys(o) as (keyof T)[];
};

export const isDecoration = (t: TypeOfComponent) =>
  ["image", "divider"].includes(t);

export const isTimeline = (t: TypeOfComponent) =>
  ["decorated-timeline"].includes(t);

export const isList = (t: TypeOfComponent) => ["list"].includes(t);

export const isHeading = (t: TypeOfComponent) => t?.startsWith("heading");

export const isName = (t: TypeOfComponent) => ["name"].includes(t);

export const isGroup = (t: TypeOfComponent) => ["group"].includes(t);

export const isIconGroup = (t: TypeOfComponent) => ["icon-group"].includes(t);

export const isText = (t: TypeOfComponent) => ["text"].includes(t);

export const isImage = (t: TypeOfComponent) => ["image"].includes(t);
