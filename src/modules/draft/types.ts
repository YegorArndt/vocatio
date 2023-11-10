import { Vacancy, User } from "@prisma/client";
import { CSSProperties, PropsWithChildren } from "react";
import * as actions from "./actions";
import type { UserResource } from "@clerk/types";

export type TypeOfComponent =
  | "heading 1"
  | "heading 2"
  | "heading 3"
  | "text"
  | "group"
  | "timeline";

export type DraftComponent = {
  id: string;
  order: number;
  type: TypeOfComponent;
  sectionId: string;
  props: {
    name: string;
    value: string;
    label: string;
    className?: string;
    style?: CSSProperties;
  };
};

export type Section = {
  id: string;
  order: number;
  components: DraftComponent[];
  className: string;
};

export type Sections = Record<string, Section>;

export type Design = {
  id: string;
  name: string;
  sections: Sections;
  components: Record<DraftComponent["type"], string>;
};

export type DraftContextInput = PropsWithChildren<{
  defaultUserData: UserResource;
  vacancy: Vacancy;
  user: User;
}>;

export type DraftState = Partial<Record<keyof typeof actions, boolean>>;
export type Dispatchers = Record<
  "setDownloadFired",
  (payload?: boolean) => void
>;

export type DraftContext = {
  design: Design;
  updateDesign: (updateFn: (design: Design) => Design) => void;
  addComponent: (component: NewComponent) => void;
  draftState: DraftState;
  dispatchers: Dispatchers;
  user: User;
  vacancy: Vacancy;
  defaultUserData: UserResource;
};

export type NewComponent = Partial<DraftComponent> & {
  type: TypeOfComponent;
};
