import { omitBy, isNil } from "lodash-es";
import { RouterOutputs } from "~/utils/api";
import { NormalizedComponent } from "../types/components";

export const heading = (text: string, grade = 2): NormalizedComponent => ({
  type: `heading-${grade}`,
  id: `heading-for-${text}`,
  sectionId: "left",
  props: {
    value: text,
    className: "",
    style: {},
    tooltip: text,
  },
});

export type TempHeadingHelper = ReturnType<typeof heading>;

const readonlyKeys = ["id", "createdAt", "updatedAt", "userId", "user"];
export const clean = (
  o: RouterOutputs["users"]["get"]["contact"],
  keys = readonlyKeys
) => omitBy(o, (value, key) => keys.includes(key) || isNil(value));
