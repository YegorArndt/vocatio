import type { GeneratedDraft } from "../types";
import type {
  NormalizedComponent,
  NormalizedProps,
  NormalizedType,
} from "../types/components";
import { RawComponent } from "../types/raw";
import { SectionId } from "../types/sections";
import { typedKeys } from "./common";

export type ComponentToNormalize = RawComponent & {
  sectionId: SectionId;
};

export const tooltips: Record<NormalizedType, string> = {
  text: "Text",
  "heading-1": "Heading 1",
  "heading-2": "Heading 2",
  "heading-3": "Heading 3",
  group: "Group",
  divider: "Divider",
  image: "Image",
  "icon-group": "Icon Group",
  entries: "Entries",
  context: "Section",
};

export const defaultProps: NormalizedProps = {
  className: "",
  style: {},
  tooltip: "",
  value: "Sample text",
  label: "Sample label",
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
export const normalize = (c: ComponentToNormalize, draft: GeneratedDraft) => {
  const hydratedValues =
    typeof c.props === "function" ? c.props(draft) : c.props;

  const normalized: NormalizedComponent = {
    ...defaultComponent,
    ...c,
    props: {
      ...defaultProps,
      tooltip: tooltips[c.type] ?? "",
      ...hydratedValues,
    },
  };

  const { sections } = normalized.props;

  if (sections) {
    const newSections = typedKeys(sections).reduce((acc, key) => {
      const section = sections[key];
      if (!section) return acc;

      const newSection = {
        ...section,
        components: section.components.map((c) =>
          // @ts-ignore
          normalize(c, draft)
        ),
      };
      return { ...acc, [key]: newSection };
    }, {});

    normalized.props.sections = newSections;
  }

  return normalized;
};
