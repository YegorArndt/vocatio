import type { NormalizedType } from "../types/components";

export const typedKeys = <T extends object>(o: T): (keyof T)[] => {
  return Object.keys(o) as (keyof T)[];
};

export const typedEntries = <T extends object>(
  obj: T
): [keyof T, T[keyof T]][] => {
  return Object.entries(obj) as [keyof T, T[keyof T]][];
};

export const isDecoration = (t: NormalizedType) =>
  ["image", "divider"].includes(t);

export const isTimeline = (t: NormalizedType) =>
  ["decorated-timeline"].includes(t);

export const isList = (t: NormalizedType) => ["list"].includes(t);

export const isHeading = (t: NormalizedType) => t?.startsWith("heading");

export const isName = (t: NormalizedType) => ["name"].includes(t);

export const isGroup = (t: NormalizedType) => ["group"].includes(t);

export const isIconGroup = (t: NormalizedType) => ["icon-group"].includes(t);

export const isText = (t: NormalizedType) => ["text"].includes(t);

export const isImage = (t: NormalizedType) => ["image"].includes(t);
