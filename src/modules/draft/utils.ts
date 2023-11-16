import { v4 as uuidv4 } from "uuid";

import type {
  Design,
  DraftComponent,
  NewComponent,
  RawDraftComponent,
  SectionId,
  Timeline,
} from "./types";
import { DBIds } from "./constants";

// In future utilize the fact that component has reference to its section in it.
const rawComponent = {
  order: 0,
  props: {
    value: "Sample text",
    label: "Sample text",
    className: "",
    style: {},
  },
};

export const toDraftComponents = (
  components: RawDraftComponent[],
  sectionId: SectionId
) => {
  const draftComponents = components.map((c, i) => {
    const normalized = { ...c };

    if (!normalized.order) normalized.order = i;
    if (!normalized.sectionId) normalized.sectionId = sectionId;
    normalized.props = { ...rawComponent.props, ...normalized.props };

    return normalized;
  });

  return draftComponents as DraftComponent[];
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
    id: uuidv4(),
    order,
    sectionId: targetSection.id,
  } as DraftComponent;

  targetSection.components = [...targetSection.components, draftComponent].sort(
    (a, b) => a.order - b.order
  );

  targetSection.components.forEach((comp, index) => {
    if (comp.id !== draftComponent.id && comp.order >= order) {
      comp.order = index + 1;
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

export const toggleClassName = (
  design: Design,
  component: DraftComponent,
  className: string
) => {
  const { sections } = design;
  const { sectionId } = component;
  const section = sections[sectionId];

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

type GetEditableDesign = {
  fields: Record<keyof typeof DBIds, string | number | undefined | null>;
  design: Design;
  vacancyId: string;
} & Pick<Timeline, "vacancyId" | "jobDescription" | "jobTitle">;

/**
 * Appends vacancyId to the name of the field so that the LS knows it.
 * Initializes the values of the fields.
 * Passes props to Timeline component.
 */
export const getEditableDesign = (args: GetEditableDesign): Design => {
  const { fields, design, vacancyId } = args;
  const { sections } = design;
  const newSections = { ...sections };

  Object.keys(newSections).forEach((sectionKey) => {
    const section = newSections[sectionKey as SectionId];

    if (!section) return;

    const { components } = section;
    const newComponents: DraftComponent[] = [];

    components.forEach((c) => {
      let newComponent: DraftComponent = c;
      if (c.id in DBIds) {
        const newValue = fields[c.id as keyof typeof DBIds] || c.props.value;

        const newProps = {
          ...c.props,
          value: newValue.toString(),
        };

        newComponent = {
          ...c,
          props: newProps,
        };
      }

      if (c.modifierId && c.modifierId in DBIds) {
        const newValue = fields[c.modifierId as keyof typeof DBIds] || "";

        const newProps = {
          ...c.props,
          value: c.modifier!(newValue.toString()),
        };

        newComponent = {
          ...c,
          props: newProps,
        };
      }

      const newId = `${c.id}-${vacancyId}`;

      newComponent = {
        ...newComponent,
        id: newId,
      };

      newComponents.push({ ...newComponent });
    });

    newSections[sectionKey as SectionId] = {
      ...section,
      components: newComponents,
    };
  });

  const { jobDescription, jobTitle } = args;

  const timelineProps = {
    jobDescription,
    jobTitle,
    vacancyId,
  };

  const newTimeline = { ...design.components.timeline, ...timelineProps };

  const newComponents = {
    ...design.components,
    timeline: newTimeline,
  };

  return {
    ...design,
    components: newComponents,
    sections: newSections,
  };
};
