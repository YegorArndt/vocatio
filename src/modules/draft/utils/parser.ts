import { type Defaults } from "../constants";
import type { Design } from "../types";
import type { RawComponent, RawDesign } from "../types/raw";
import type { Sections } from "../types/sections";
import { typedKeys, isDecoration } from "./common";

const applyModifiers = (rc: RawComponent, defaults: Defaults) => {
  const { modifierFn, modifierIds, props } = rc;

  if (!modifierFn || !modifierIds) {
    const newProps = {
      ...props,
      value: defaults[rc.id] ?? props?.value,
    };
    return newProps;
  }

  const defaultValues = modifierIds.map((id) => defaults[id]).flat();
  const newProps = modifierFn(defaultValues, props);

  return { ...props, ...newProps };
};

const getProps = (
  rc: RawComponent,
  defaults: Defaults,
  d: RawDesign | Design
) => {
  const rcCopy = {
    ...rc,
    props: { className: "", style: {}, ...rc.props },
  };

  const modified = applyModifiers(rcCopy, defaults);

  return modified;
};

export const parser = (
  defaults: Defaults,
  rawDesign: RawDesign | Design,
  vacancyId: string,
  jobTitle: string,
  jobDescription: string
): Design => {
  const processedSections = {} as Sections;
  const { sections } = rawDesign;

  typedKeys(sections).forEach((sectionId) => {
    const section = sections[sectionId]!;
    const { components } = section;

    const processedComponents = components.map((rc, i) => {
      const { id, ...rest } = rc;

      const newId = `${id}-${vacancyId}`;

      const component = {
        ...rest,
        isDecoration: isDecoration(rc.type),
        order: i + 1,
        id: newId,
        sectionId,
        props: { ...getProps(rc, defaults, rawDesign) },
      };

      return component;
    });

    processedSections[sectionId] = {
      ...section,
      components: processedComponents,
    };
  });

  return {
    ...rawDesign,
    sections: processedSections,
  };
};
