import { DndProviderProps } from "./baseComponents/DndProvider";
import { GroupProps } from "./baseComponents/Group";
import { AutoresizeProps } from "./baseComponents/Autoresize";
import { ExperienceEntry } from "@prisma/client";
import { PartialVacancy, RouterUser } from "./extension/types";

export type GeneratedDraft = {
  vacancy: PartialVacancy;
  vacancyResponsibilities: string[];
  vacancySkills: string[];

  generatedProfessionalSummary: string;
  generatedExperience: (ExperienceEntry & { generatedDescription: string[] })[];
  generatedSkills: { id: string; name: string }[];
  coverLetter?: string;
} & RouterUser;

export type Design = {
  id: string;
  name: string;
  a4ClassName: string;
  sections: Sections;
  baseComponents: Record<BaseComponentType, BaseComponentProps>;
  image: string;
  pokemonImage: string;
  font: string;
  background: string;
};

export type HydratableComponent = {
  type: BaseComponentType;
  id: string;
  sectionId: SectionName;
  /**
   * Hydratable means it will be hydrated with `ls.user` data or AI generated data.
   * Used for `UserImage`, `Contact`, `Education`, `Experience`, `Skills`, `Languages` components.
   */
  hydratableProps?: (data: GeneratedDraft) => DndProviderProps;
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
