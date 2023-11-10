import { v4 as uuidv4 } from "uuid";
import { Design, DraftComponent, NewComponent } from "./types";

// In future utilize the fact that component has reference to its section in it.

const rawComponent = {
  order: 0,
  props: {
    name: "Sample text",
    value: "Sample text",
    label: "Sample text",
  },
};

export const addNewComponent = (
  design: Design,
  component: NewComponent
): Design => {
  const { sections } = design;
  const firstKey = Object.keys(sections)[0];

  if (!firstKey) return design;

  const firstSection = sections[firstKey];

  if (!firstSection) return design;

  const { components } = firstSection;

  const newComponent = {
    ...rawComponent,
    id: uuidv4(),
    ...component,
  } as DraftComponent;
  const newComponents = [newComponent, ...components];

  console.log(newComponent);

  const newSection = {
    ...firstSection,
    components: newComponents,
  };

  const newSections = {
    ...design.sections,
    [firstKey]: newSection,
  };

  return {
    ...design,
    sections: newSections,
  };
};
