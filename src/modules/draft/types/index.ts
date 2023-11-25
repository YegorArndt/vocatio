import type { Vacancy, User } from "@prisma/client";
import type { ReactNode } from "react";
import * as actions from "../actions";
import type { UserResource } from "@clerk/types";
import type {
  NormalizedComponent,
  RawComponent,
  TypeOfComponent,
} from "./components";
import type { Defaults } from "../constants";
import type { Design, RawDesign } from "./design";

export type DraftContextInput = {
  defaultUserData: UserResource;
  vacancy: Vacancy;
  user: User;
  children: (a: DraftContext) => ReactNode;
};

export type DraftState = Partial<Record<keyof typeof actions, boolean>>;
export type Dispatchers = Record<
  "setDownloadFired" | "setChangeDesignFired",
  (payload?: boolean) => void
>;

export type DraftContext = {
  design: Design;
  updateDesign: (updateFn: (d: Design) => Design) => void;
  changeDesign: (d: RawDesign) => void;
  toggleClassName: (component: NormalizedComponent, className: string) => void;
  addNewComponent: (
    rc: RawComponent,
    clickedComponent: NormalizedComponent
  ) => void;
  changeComponentType: (
    componentToChange: NormalizedComponent,
    type: TypeOfComponent
  ) => void;
  rotate: (heading: NormalizedComponent, index: number) => void;
  removeComponent: (componentToRemove: NormalizedComponent) => void;
  draftState: DraftState;
  dispatchers: Dispatchers;
  user: User;
  vacancy: Vacancy;
  defaultUserData: UserResource;
  defaults: Defaults;
};
