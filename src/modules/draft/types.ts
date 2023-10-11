import { type Dispatch } from "react";
import { useForm } from "react-hook-form";
import { useUser } from "@clerk/nextjs";
import type { Vacancy, User, Cv, Component } from "@prisma/client";

import { readFromLocalStorage } from "./utils";
import * as actions from "./actions";

/**
 * When creating CV from scratch, we need to provide an initial ID for DND.
 * Before saving, we need to remove it so that Prisma can generate a new one.
 */
export type DraftComponent = Pick<
  Component,
  "areaId" | "component" | "index" | "label"
> & { id: string; name: string; defaultValue: string; placeholder: string };

export type ActionType = (typeof actions)[keyof typeof actions];

export type DraftState = {
  isRearranging: boolean;
};

export type Action = {
  type: ActionType;
  payload: Partial<DraftState>;
};

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
  state: DraftState;
  rawData: RawData;
  dispatch: Dispatch<Action>;
  getDefaultValue: ReturnType<typeof readFromLocalStorage>;
} & ReturnType<typeof useForm>;
