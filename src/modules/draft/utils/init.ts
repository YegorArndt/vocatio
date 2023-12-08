import type { RawDesign, Design } from "../types/design";
import type { Sections } from "../types/sections";
import { typedKeys } from "./common";
import { Defaults } from "./getDefaults";
import { normalize } from "./normalize";

export const init = (
  defaults: Defaults,
  rawDesign: RawDesign,
  vacancyId: string
): Design => {
  const initializedSections = {} as Sections;
  const { sections } = rawDesign;

  typedKeys(sections).forEach((sectionId) => {
    const section = sections[sectionId]!;
    const { components } = section;

    const normalizedComponents = components.map((rc, i) =>
      normalize(
        {
          ...rc,
          order: i,
          sectionId,
        },
        defaults,
        vacancyId
      )
    );

    initializedSections[sectionId] = {
      ...section,
      components: normalizedComponents,
    };
  });

  return {
    ...rawDesign,
    sections: initializedSections,
  };
};
