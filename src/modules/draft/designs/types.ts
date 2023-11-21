import type { Story } from "@prisma/client";
import { dbIds } from "../constants";
import type {
  DraftComponent,
  IntrinsicDesignComponents,
} from "../types/components";
import type { Section, SectionId } from "../types/sections";

type RawProps = Partial<DraftComponent["props"]>;

export type RawComponent = Omit<
  DraftComponent,
  "value" | "props" | "sectionId" | "order" | "isDecoration"
> & {
  props?: RawProps;
  modifierIds?: (typeof dbIds)[number][];
  modifierFn?: (
    dbValues: (string | undefined | null | number | Story)[],
    props: RawProps | undefined
  ) => RawProps;
};

export type RawSection = Omit<Section, "components"> & {
  components: RawComponent[];
};

export type RawDesign = {
  id: string;
  name: string;
  a4: string;
  intrinsic: IntrinsicDesignComponents;
  sections: Partial<Record<SectionId, RawSection>>;
  font: string;
  image: string;
  pokemonImage: string;
};
