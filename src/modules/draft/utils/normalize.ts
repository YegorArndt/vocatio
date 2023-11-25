import type { Defaults } from "../constants";
import { hydrate } from "./hydrate";
import type { NormalizedComponent, RawComponent } from "../types/components";
import type { SectionId } from "../types/sections";

const defaultProps = {
  className: "",
  style: {},
  value: "Sample text",
  label: "Sample text",
};

const defaultComponent = {
  order: 0,
  sectionId: "left",
};

/**
 * Assign default values to component.
 */
export const normalize = (
  c: (RawComponent | NormalizedComponent) & {
    order: number;
    sectionId: SectionId;
  },
  defaults: Defaults,
  vacancyId: string
) => {
  const normalized = {
    ...defaultComponent,
    ...c,
    id: `${c.id}-${vacancyId}`,
    props: { ...defaultProps, ...c.props },
  };
  const hydrated = hydrate(normalized, defaults, c.id);

  return hydrated;
};
