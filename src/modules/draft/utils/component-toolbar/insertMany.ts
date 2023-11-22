import { v4 as uuidv4 } from "uuid";

import { NormalizedComponent, RawComponent } from "../../types/components";
import { Design } from "../../types/design";
import { normalize } from "../normalize";
import type { Defaults } from "../../constants";

export const insertMany = (
  design: Design,
  newComponents: RawComponent[],
  clickedComponent: NormalizedComponent,
  defaults: Defaults,
  vacancyId: string
): Design => {
  const sections = { ...design.sections };
  const targetSection = sections[clickedComponent.sectionId];

  if (!targetSection) return design;

  const order = clickedComponent.order + 1;

  const normalizedComponents = newComponents.map((component, index) =>
    normalize(
      {
        ...component,
        id: uuidv4(),
        order: order + index,
        sectionId: targetSection.id,
      },
      defaults,
      vacancyId
    )
  );

  targetSection.components = [
    ...targetSection.components,
    ...normalizedComponents,
  ].sort((a, b) => a.order - b.order);

  targetSection.components.forEach((c, index) => {
    if (
      c.id !== normalizedComponents[0].id &&
      c.order >= normalizedComponents[0].order
    ) {
      c.order = index + 1;
    }
  });

  return {
    ...design,
    sections: {
      ...sections,
      [targetSection.id]: targetSection,
    },
  };
};
