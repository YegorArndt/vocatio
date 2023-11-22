import type { NormalizedComponent } from "../../types/components";
import type { Design } from "../../types/design";

export const toggle = (
  design: Design,
  component: NormalizedComponent,
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
