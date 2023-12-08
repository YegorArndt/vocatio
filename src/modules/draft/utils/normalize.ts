import type {
  NormalizedComponent,
  NormalizedProps,
  RawComponent,
} from "../types/components";
import { SectionId } from "../types/sections";
import { Defaults } from "./getDefaults";

type ComponentToNormalize = RawComponent & {
  order: number;
  sectionId: SectionId;
};

const defaultProps: NormalizedProps = {
  className: "",
  style: {},
};

const defaultComponent: NormalizedComponent = {
  id: "",
  type: "text",
  order: 0,
  sectionId: "left",
  props: defaultProps,
};

/**
 * Standardizes the component.
 */
export const normalize = (
  c: ComponentToNormalize,
  defaults: Defaults,
  vacancyId: string
) => {
  const normalized = {
    ...defaultComponent,
    ...c,
    id: `${c.id}-${vacancyId}`,
    props: { ...defaultProps, ...c.props },
  };

  if (c.initializer) {
    const initialized = c.initializer(defaults, normalized.props);

    normalized.props = {
      ...normalized.props,
      ...initialized,
    };
  }

  return normalized;
};
