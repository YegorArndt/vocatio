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
    innerHTML: "",
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
  component: NewComponent
): Design => {
  const { sections } = design;
  const firstKey = Object.keys(sections)[0];

  if (!firstKey) return design;

  const firstSection = sections[firstKey as SectionId];

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
