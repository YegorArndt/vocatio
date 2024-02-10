import type { NormalizedComponent, NormalizedType } from "./components";
import type { Sections } from "./sections";

export type Intrinsic = Partial<
  Record<NormalizedType, Partial<NormalizedComponent["props"]>>
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
