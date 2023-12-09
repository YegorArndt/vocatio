import type {
  ComponentToNormalize,
  NormalizedComponent,
  NormalizedProps,
  NormalizedType,
} from "../types/components";
import { typedKeys } from "./common";
import { Defaults } from "./getDefaults";

const tooltips: Record<NormalizedType, string> = {
  text: "Text",
  "heading-1": "Heading 1",
  "heading-2": "Heading 2",
  "heading-3": "Heading 3",
  group: "Group",
  divider: "Divider",
  url: "URL",
  image: "Image",
  "icon-group": "Icon Group",
  entries: "Entries",
};

const defaultProps: NormalizedProps = {
  className: "",
  style: {},
  tooltip: "",
};

const defaultComponent: NormalizedComponent = {
  id: "",
  type: "text",
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
  const p = typeof c.props === "function" ? c.props(defaults) : c.props;

  const normalized: NormalizedComponent = {
    ...defaultComponent,
    ...c,
    id: `${c.id}-${vacancyId}`,
    props: { ...defaultProps, tooltip: tooltips[c.type] ?? "", ...p },
  };

  let { sections } = normalized.props;

  if (sections) {
    const newSections = typedKeys(sections).reduce((acc, key) => {
      const section = sections![key];
      if (!section) return acc;

      const newSection = {
        ...section,
        components: section.components.map((c) =>
          normalize(c, defaults, vacancyId)
        ),
      };
      return { ...acc, [key]: newSection };
    }, {});

    normalized.props.sections = newSections;
  }

  return normalized;
};
