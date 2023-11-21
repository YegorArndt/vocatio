import { v4 as uuidv4 } from "uuid";

import { DraftComponent, TypeOfComponent } from "../types/components";
import { Design, NewComponent } from "../types/processed";
import { isDecoration } from "./common";

const rawComponent = {
  order: 0,
  props: {
    value: "Sample text",
    label: "Sample text",
    className: "",
    style: {},
  },
};

export const removeComponent = (
  design: Design,
  componentToDelete: DraftComponent
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

export const changeComponentType = (
  design: Design,
  componentToChange: DraftComponent,
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

export const toggleCn = (
  design: Design,
  component: DraftComponent,
  className: string
) => {
  const { sections } = design;
  const { sectionId } = component;
  const section = sections[sectionId];

  console.log(section);

  if (!section) return design;

  const { components } = section;

  const newComponents = components.map((c) => {
    if (c.id !== component.id) return c;

    // Split existing class names into an array
    const existingClassNames = c.props.className
      ? c.props.className.split(" ")
      : [];

    // Check if the class name to be toggled is already in the array
    const classNameIndex = existingClassNames.indexOf(className);

    if (classNameIndex === -1) {
      // Class name not found, add it
      existingClassNames.push(className);
    } else {
      // Class name found, remove it
      existingClassNames.splice(classNameIndex, 1);
    }

    // Join the class names back into a string
    const newClassName = existingClassNames.join(" ");

    const newProps = {
      ...c.props,
      className: newClassName,
    };

    return {
      ...c,
      props: newProps,
    };
  });

  // Return the updated design with the new components array
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

export const addNewComponent = (
  design: Design,
  newComponent: NewComponent,
  clickedComponent: DraftComponent
): Design => {
  const sections = { ...design.sections };
  const targetSection = sections[clickedComponent.sectionId];

  if (!targetSection) return design;

  const order = clickedComponent.order + 1;
  const draftComponent = {
    ...rawComponent,
    ...newComponent,
    isDecoration: isDecoration(newComponent.type),
    id: uuidv4(),
    order,
    sectionId: targetSection.id,
  };

  targetSection.components = [...targetSection.components, draftComponent].sort(
    (a, b) => a.order - b.order
  );

  targetSection.components.forEach((c, index) => {
    if (c.id !== draftComponent.id && c.order >= order) {
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
