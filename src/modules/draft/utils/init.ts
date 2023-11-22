import { type Defaults } from "../constants";
import type { RawDesign, Design } from "../types/design";
import type { Sections } from "../types/sections";
import { typedKeys } from "./common";
import { normalize } from "./normalize";

export const init = (
  defaults: Defaults,
  rawDesign: RawDesign,
  vacancyId: string,
  jobTitle: string,
  jobDescription: string
): Design => {
  const initializedSections = {} as Sections;
  const { sections } = rawDesign;

  typedKeys(sections).forEach((sectionId) => {
    const section = sections[sectionId]!;
    const { components } = section;

    const normalizedComponents = components.map((rc, i) => {
      const normalized = normalize(
        {
          ...rc,
          order: i + 1,
          sectionId,
        },
        defaults,
        vacancyId
      );

      return normalized;
    });

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
