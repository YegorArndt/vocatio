import { useUser } from "@clerk/nextjs";
import type { Vacancy, User, Cv, Component } from "@prisma/client";

export type LsComponent = Pick<
  Component,
  "areaId" | "component" | "index" | "label" | "value"
>;

/**
 * When creating CV from scratch, we need to provide an initial ID for DND.
 * Before saving, we need to remove it so that Prisma can generate a new one.
 */
export type DraftComponent = Pick<
  Component,
  "areaId" | "component" | "index" | "label"
> & { id: string; defaultValue: string; placeholder: string };

export type RawData = {
  defaultUserData: ReturnType<typeof useUser>["user"];
  vacancy: Vacancy;
  user: User | null | undefined;
};

export type DraftContextInput = {
  initialDraft: Partial<Cv>;
  rawData: Partial<RawData>;
};

export type DraftContextOutput = {
  currentDraft: Cv;
  rawData: RawData;
  commit: (component: LsComponent) => void;
};
