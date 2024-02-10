import { NormalizedComponent, PropsInitializer } from "./components";
import { Design } from "./design";
import { SectionId } from "./sections";

export type RawComponent = Pick<NormalizedComponent, "type" | "id"> & {
  props?: PropsInitializer;
};

export type RawSection = {
  id: SectionId;
  components: RawComponent[];
  className: string;
};

export type RawSections = Partial<Record<SectionId, RawSection>>;

export type RawDesign = Omit<Design, "sections"> & {
  sections: RawSections;
};
