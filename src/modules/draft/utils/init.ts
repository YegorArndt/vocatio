import type { LsDraft } from "../types";
import type { Design } from "../types/design";
import { RawDesign } from "../types/raw";
import type { Sections } from "../types/sections";
import { typedKeys } from "./common";
import { normalize } from "./normalize";

export const init = (draft: LsDraft, rawDesign: RawDesign): Design => {
  const initializedSections = {} as Sections;
  const { sections } = rawDesign;

  typedKeys(sections).forEach((sectionName) => {
    const section = sections[sectionName];
    if (!section) return;

    const { components } = section;

    const normalizedComponents = components.map((rc) =>
      normalize(
        {
          ...rc,
          sectionId: sectionName,
        },
        draft
      )
    );

    initializedSections[sectionName] = {
      ...section,
      components: normalizedComponents,
    };
  });

  return {
    ...rawDesign,
    sections: initializedSections,
  };
};
