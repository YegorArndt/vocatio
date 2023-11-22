import type { NormalizedComponent } from "../../types/components";
import type { Design } from "../../types/design";

export const remove = (
  design: Design,
  componentToDelete: NormalizedComponent
): Design => {
  const sections = { ...design.sections };
  const { sectionId } = componentToDelete;

  const targetSection = sections[sectionId];
  if (!targetSection) return design;

  const updatedComponents = targetSection.components.filter(
    (component) => component.id !== componentToDelete.id
  );

  sections[sectionId] = {
    ...targetSection,
    components: updatedComponents,
  };

  return {
    ...design,
    sections,
  };
};
