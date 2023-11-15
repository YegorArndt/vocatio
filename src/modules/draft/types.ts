import type { Vacancy, User } from "@prisma/client";
import type { CSSProperties, ReactNode } from "react";
import * as actions from "./actions";
import type { UserResource } from "@clerk/types";

export type SectionId = "top" | "left" | "right" | "bottom";
export type StoryType = 1 | 2;

export type TypeOfComponent =
  | `heading-${number}`
  | "text"
  | "group"
  | "divider"
  | "list"
  | "url"
  | "image"
  | "timeline"
  | "skills"
  | "education"
  | "languages";

export type DraftComponent = {
  id: string;
  order: number;
  type: TypeOfComponent;
  sectionId: SectionId;
  props: {
    innerHTML: string;
    value: string;
    label: string;
    className: string;
    style: CSSProperties;
  };
  modifierId?: string;
  modifier?: (value: string) => string;
};

export type RawDraftComponent = Omit<Partial<DraftComponent>, "props"> & {
  props?: Partial<DraftComponent["props"]>;
};

export type Section = {
  id: string;
  order: number;
  components: DraftComponent[];
  className: string;
  sections?: Sections;
};

export type Sections = Partial<Record<SectionId, Section>>;

export type Timeline = {
  storyType: StoryType;
  jobDescription: string;
  jobTitle: string;
  vacancyId: string;
  className?: string;
};

export type Components =
  | Partial<
      Omit<
        Record<
          DraftComponent["type"],
          {
            className?: string;
            style?: CSSProperties;
            [key: string]: unknown;
          }
        >,
        "timeline"
      >
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
