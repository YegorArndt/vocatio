import type { NormalizedComponent, TypeOfComponent } from "./components";
import type { RawSections, Sections } from "./sections";

export type Intrinsic = Partial<
  Record<TypeOfComponent, Partial<NormalizedComponent["props"]>>
>;

export type Design = {
  id: string;
  name: string;
  sections: Sections;
  intrinsic: Intrinsic;
  a4: string;
  font: string;
  image: string;
  pokemonImage: string;
};

export type RawDesign = Omit<Design, "sections"> & {
  sections: RawSections;
};
