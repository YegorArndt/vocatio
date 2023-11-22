import type {
  NormalizedComponent,
  TypeOfComponent,
} from "../../types/components";
import type { Design } from "../../types/design";

export const changeType = (
  design: Design,
  componentToChange: NormalizedComponent,
  newType: TypeOfComponent
): Design => {
  const sections = { ...design.sections };
  const { sectionId } = componentToChange;

  const targetSection = sections[sectionId];
  if (!targetSection) return design;

  const newComponents = targetSection.components.map((component) => {
    if (component.id === componentToChange.id) {
      return {
        ...component,
        type: newType,
      };
    }
    return component;
  });

  sections[sectionId] = {
    ...targetSection,
    components: newComponents,
  };

  return {
    ...design,
    sections,
  };
};
