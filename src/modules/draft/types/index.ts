import type { Vacancy, User } from "@prisma/client";
import type { ReactNode } from "react";
import * as actions from "../actions";
import type { UserResource } from "@clerk/types";
import type {
  DraftComponent,
  IntrinsicDesignComponents,
  TypeOfComponent,
} from "./components";
import type { Sections } from "./sections";

export type Design = {
  id: string;
  name: string;
  sections: Sections;
  intrinsic: IntrinsicDesignComponents;
  a4: string;
  font: string;
  image: string;
  pokemonImage: string;
};

export type DraftContextInput = {
  defaultUserData: UserResource;
  vacancy: Vacancy;
  user: User;
  children: (a4: string, changingDesign: boolean) => ReactNode;
};

export type DraftState = Partial<Record<keyof typeof actions, boolean>>;
export type Dispatchers = Record<
  "setDownloadFired" | "setChangeDesignFired",
  (payload?: boolean) => void
>;

export type DraftContext = {
  design: Design;
  updateDesign: (updateFn: (design: Design) => Design) => void;
  add: (nc: NewComponent, clickedComponent: DraftComponent) => void;
  changeDesign: (design: Design) => void;
  toggleClassName: (component: DraftComponent, className: string) => void;
  changeType: (
    componentToChange: DraftComponent,
    type: TypeOfComponent
  ) => void;
  remove: (componentToRemove: DraftComponent) => void;
  draftState: DraftState;
  dispatchers: Dispatchers;
  user: User;
  vacancy: Vacancy;
  defaultUserData: UserResource;
};

export type NewComponent = Partial<DraftComponent> & {
  type: TypeOfComponent;
};
