import type { TypeOfComponent } from "../types/components";

export const typedKeys = <T extends object>(o: T): (keyof T)[] => {
  return Object.keys(o) as (keyof T)[];
};

export const isDecoration = (t: TypeOfComponent) =>
  ["image", "divider"].includes(t);

export const isTimeline = (t: TypeOfComponent) =>
  ["decorated-timeline"].includes(t);
