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

  if (!section) return design;

  const { components } = section;

  const newComponents = components.map((c) => {
    if (c.id !== component.id) return c;

    // Split existing class names into a Set to ensure uniqueness
    const existingClassNames = new Set(
      c.props.className ? c.props.className.split(" ") : []
    );

    // Toggle the class name
    if (existingClassNames.has(className)) {
      existingClassNames.delete(className);
    } else {
      existingClassNames.add(className);
    }

    // Convert the Set back into a string
    const newClassName = Array.from(existingClassNames).join(" ");

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
