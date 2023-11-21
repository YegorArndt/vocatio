import { type CSSProperties } from "react";

import { type Defaults } from "../constants";
import type { Design } from "../types/processed";
import type { RawComponent, RawDesign } from "../types/raw";
import type { Sections } from "../types/sections";
import { typedKeys, isDecoration } from "./common";

const mergeWithIntrinsic = (
  c: RawComponent & { props: { className: string; style: CSSProperties } },
  d: RawDesign | Design
) => {
  const { intrinsic } = d;
  const intrinsicComponent = intrinsic[c.type];
  if (!intrinsicComponent) return c.props;

  const { className: k, style: s } = c.props;

  const className = `${c.type} ${intrinsicComponent.className || ""} ${k}`;
  const style = { ...intrinsicComponent.style, ...s };

  return { ...intrinsicComponent, ...c.props, className, style };
};

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

  const merged = mergeWithIntrinsic(rcCopy, d);
  const modified = applyModifiers({ ...rcCopy, props: merged }, defaults);

  return modified;
};

export const getProcessedDesign = (
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
        props: { ...getProps(rc, defaults, rawDesign), id: newId },
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
