import type { NormalizedComponent } from "./components";

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
  components: NormalizedComponent[];
  className?: string;
};

export type Sections = Partial<Record<SectionId, Section>>;
