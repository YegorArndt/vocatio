import { v4 as uuidv4 } from "uuid";

import { Defaults } from "../../constants";
import { NormalizedComponent, RawComponent } from "../../types/components";
import { Design } from "../../types/design";
import { normalize } from "../normalize";

export const add = (
  design: Design,
  vacancyId: string,
  defaults: Defaults,
  newComponent: RawComponent,
  clickedComponent: NormalizedComponent
): Design => {
  const sections = { ...design.sections };
  const targetSection = sections[clickedComponent.sectionId];

  if (!targetSection) return design;

  const order = clickedComponent.order + 1;

  const normalizedComponent = normalize(
    {
      ...newComponent,
      id: uuidv4(),
      order,
      sectionId: targetSection.id,
    },
    defaults,
    vacancyId
  );

  targetSection.components = [
    ...targetSection.components,
    normalizedComponent,
  ].sort((a, b) => a.order - b.order);

  targetSection.components.forEach((c, index) => {
    if (c.id !== normalizedComponent.id && c.order >= order) {
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
