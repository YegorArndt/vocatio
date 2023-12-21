import { NormalizedComponent } from "../types/components";

export const heading = (text: string): NormalizedComponent => ({
  type: "heading-2",
  id: `heading-for-${text}`,
  sectionId: "left",
  props: {
    value: text,
    className: "",
    style: {},
    tooltip: "text",
  },
});

export type TempHeadingHelper = ReturnType<typeof heading>;
