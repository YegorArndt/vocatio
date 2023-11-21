import type { DraftComponent } from "./components";

export type SectionId =
  | "top"
  | "left"
  | "right"
  | "bottom"
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | "body-left"
  | "body-right";

export type Section = {
  id: SectionId;
  order: number;
  components: DraftComponent[];
  className: string;
};

export type Sections = Partial<Record<SectionId, Section>>;
