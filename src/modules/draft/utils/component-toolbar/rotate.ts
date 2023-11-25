import { arrayMove } from "@dnd-kit/sortable";
import { NormalizedComponent } from "../../types/components";
import { Design } from "../../types/design";
import { SectionId } from "../../types/sections";

const createSections = (components: NormalizedComponent[]) => {
  const sections = [];
  let currentSection = [] as NormalizedComponent[];

  components.forEach((component) => {
    if (component.type.includes("heading")) {
      if (currentSection.length > 0) {
        sections.push(currentSection);
      }
      currentSection = [component];
    } else {
      currentSection.push(component);
    }
  });

  // Add the last section
  if (currentSection.length > 0) {
    sections.push(currentSection);
  }

  return sections;
};

export const rotateSectionByTitle = (
  design: Design,
  sectionId: SectionId,
  titleValue: string,
  newIndex: number
) => {
  const section = design.sections[sectionId];
  if (!section) return design;

  const sections = createSections(section.components);
  const sectionIndex = sections.findIndex(
    (s) => s[0]!.props?.value === titleValue
  );

  // Check if the section is already at the desired position
  if (
    sectionIndex === -1 ||
    newIndex >= sections.length ||
    sectionIndex === newIndex
  ) {
    return design; // Title not found, invalid newIndex, or section already at newIndex
  }

  // Move the section to the new index
  const movedSections = arrayMove(sections, sectionIndex, newIndex);

  // Flatten the sections back into a single array
  const newComponents = movedSections.flat();

  return {
    ...design,
    sections: {
      ...design.sections,
      [sectionId]: {
        ...section,
        components: newComponents,
      },
    },
  };
};
