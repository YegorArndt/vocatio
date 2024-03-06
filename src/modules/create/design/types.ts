import { Rubik, EB_Garamond, Noto_Serif, Inter } from "next/font/google";

import { DndProviderProps } from "./base-components/dnd/DndProvider";
import { GroupProps } from "./base-components/Group";
import { AutoresizeProps } from "./base-components/Autoresize";
import { Cv, CvExperienceEntry } from "~/modules/init-gen/types";

const rubik = Rubik({ subsets: ["latin"] });
const garamond = EB_Garamond({ subsets: ["latin"] });
const notoSerif = Noto_Serif({ subsets: ["latin"] });
const inter = Inter({ subsets: ["latin"] });

export const fonts = {
  rubik: {
    name: "Rubik",
    font: rubik,
  },
  garamond: {
    name: "Garamond",
    font: garamond,
  },
  serif: {
    name: "Serif",
    font: notoSerif,
  },
  times: {
    name: "Times New Roman",
    font: "times",
  },
  arial: {
    name: "Arial",
    font: "arial",
  },
  inter: {
    name: "Inter",
    font: inter,
  },
};

export type DesignFont = keyof typeof fonts;
export type DesignName = "charmander" | "charizard";

export type Design = {
  id: string;
  name: DesignName;
  a4ClassName: string;
  sections: Sections;
  baseComponents: Record<BaseComponentType, BaseComponentProps>;
  image: string;
  pokemonImage: string;
  font: DesignFont;
  background: string;
};

export type HydrationData = Partial<Cv> | CvExperienceEntry | undefined;

export type HydratableComponent = {
  type: BaseComponentType;
  id: string;
  sectionId: SectionName;
  /**
   * Hydratable means it will be hydrated with `user` data or AI generated data.
   * Used for `UserImage`, `Contact`, `Education`, `Experience`, `Skills`, `Languages` components.
   */
  hydratableProps?: (data: HydrationData) => DndProviderProps;
  /**
   * Hydrated means it doesn't expect any fn to hydrate it.
   * Used for `Group` component.
   */
  hydratedProps?: GroupProps | AutoresizeProps;
};

/**
 * A section is a sortable context in which components can be dragged and dropped.
 */
export type SectionName =
  | "left"
  | "right"
  | "top-left"
  | "top-right"
  | "contact"
  | "education"
  | "experience"
  | "skills"
  | "languages"
  | string;

export type SectionProps = {
  id: SectionName;
  className?: string;
  components: HydratableComponent[];
};

export type Sections = Record<SectionName, SectionProps>;

export type AnySection = Sections[keyof Sections];

/**
 * Empty components the user can add if hydrated (with user's / AI generated data) ones don't hit the mark.
 */
export type BaseComponentType =
  | "userImage"
  | "userName"
  | "jobTitle"
  | "professionalSummary"
  | "contact"
  | "languages"
  | "skills"
  | "education"
  | "experience"
  | "experience-entry"
  | "bullet"
  | `heading-${number}`
  | "group"
  | "icon-group"
  | "text"
  | "divider"
  | "entry";

export type BaseComponentProps = {
  className?: string;
  style?: React.CSSProperties;
};
