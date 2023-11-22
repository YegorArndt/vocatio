import type { NormalizedComponent, RawComponent } from "./components";

export type SectionId =
  | "top"
  | "left"
  | "right"
  | "bottom"
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

export type Section = {
  id: SectionId;
  order: number;
  components: NormalizedComponent[];
  className: string;
};

export type Sections = Partial<Record<SectionId, Section>>;

export type RawSection = {
  id: SectionId;
  order: number;
  components: RawComponent[];
  className: string;
};

export type RawSections = Partial<Record<SectionId, RawSection>>;
