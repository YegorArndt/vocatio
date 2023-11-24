import type { NormalizedComponent } from "../../types/components";
import type { Design } from "../../types/design";

export const remove = (
  design: Design,
  componentToDelete: NormalizedComponent,
  vacancyId: string
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

  // Get componentToDelete component from LS
  const componentToDeleteFromLS = localStorage.getItem(
    `deleted-components-${vacancyId}`
  );
  // Store componentToDelete component in LS
  localStorage.setItem(
    `deleted-components-${vacancyId}`,
    JSON.stringify([
      ...((componentToDeleteFromLS
        ? JSON.parse(componentToDeleteFromLS)
        : []) as NormalizedComponent[]),
      componentToDelete,
    ])
  );

  window.dispatchEvent(new Event("storageUpdate"));

  return {
    ...design,
    sections,
  };
};
