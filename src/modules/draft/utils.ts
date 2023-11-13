import { v4 as uuidv4 } from "uuid";

import type { Design, DraftComponent, NewComponent, Timeline } from "./types";
import { DBIds } from "./constants";

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
    const section = newSections[sectionKey]!;
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

      const newId = `${c.id}-${vacancyId}`;

      newComponent = {
        ...newComponent,
        id: newId,
      };

      newComponents.push({ ...newComponent });
    });

    newSections[sectionKey] = {
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

  console.log("utils/newComponents", newComponents);
  console.log("utils/newSections", newSections);
  console.log("utils/newTimeline", newTimeline);

  return {
    ...design,
    components: newComponents,
    sections: newSections,
  };
};
