import { Vacancy, User } from "@prisma/client";
import { CSSProperties, ReactNode } from "react";
import * as actions from "./actions";
import type { UserResource } from "@clerk/types";

export type TypeOfComponent =
  | "heading 1"
  | "heading 2"
  | "heading 3"
  | "text"
  | "group"
  | "timeline"
  | "divider";

export type DraftComponent = {
  id: string;
  order: number;
  type: TypeOfComponent;
  sectionId: string;
  props: {
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

export type Timeline = {
  styles: {
    timelineClassNames: string;
    storyClassNames: string;
    dateOfEmploymentClassNames: string;
    companyNameClassNames: string;
    jobTitleClassNames: string;
  };
  jobDescription: string;
  jobTitle: string;
  vacancyId: string;
};

export type Components = Omit<
  Record<DraftComponent["type"], string>,
  "timeline"
> & {
  timeline: Timeline;
};

export type Design = {
  id: string;
  name: string;
  sections: Sections;
  components: Components;
  a4: string;
  font: string;
  image: string;
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
  addComponent: (component: NewComponent) => void;
  changeDesign: (design: Design) => void;
  draftState: DraftState;
  dispatchers: Dispatchers;
  user: User;
  vacancy: Vacancy;
  defaultUserData: UserResource;
};

export type NewComponent = Partial<DraftComponent> & {
  type: TypeOfComponent;
};
