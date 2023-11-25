import { MenuProps } from "@szhsin/react-menu";
import { TypeOfComponent } from "~/modules/draft/types/components";
import { Intrinsic } from "~/modules/draft/types/design";
import { SectionId } from "~/modules/draft/types/sections";
import {
  isDecoration,
  isGroup,
  isHeading,
  isIconGroup,
  isList,
  isName,
  isText,
  isTimeline,
  typedKeys,
} from "~/modules/draft/utils/common";

export const getDirection = (id: SectionId) =>
  id.includes("top") ? "bottom" : "top";

export const getMenuProps = (
  direction: "top" | "bottom"
): Partial<MenuProps> => ({
  gap: 5,
  transition: true,
  direction,
  menuClassName: "z-dropdown",
  portal: true,
});

export const getComponentNameByType = (t: TypeOfComponent, id: string) => {
  let word = "";

  if (isGroup(t) || isIconGroup(t)) word = id.split("-")[0]!;

  if (isName(t)) word = "Name";

  if (isHeading(t)) word = "Heading";

  if (isTimeline(t)) word = "Timeline";

  if (isDecoration(t)) {
    if (t.includes("image")) word = "Image";
    if (t.includes("divider")) word = "Divider";
  }

  if (isList(t)) {
    const parts = id.split("-");
    word = parts[0]!;
    if (parts[1] === "copy") word = `copied ${word}`;
  }

  return word;
};

export const getAddText = (t: TypeOfComponent, id: string) => {
  if (isList(t)) return `Add after ${getComponentNameByType(t, id)}`;
  if (isTimeline(t)) return `Add after Timeline`;
  else return null;
};

export const toAllowedTypes = (intrinsic: Intrinsic, t: TypeOfComponent) => {
  const possibleTurnIntos = typedKeys(intrinsic);

  const filtered: TypeOfComponent[] = [];
  const filteredOut: TypeOfComponent[] = [];

  possibleTurnIntos.forEach((i) => {
    if (isDecoration(i)) return;

    if (isHeading(t) || isName(t)) {
      if (i !== t && !isGroup(i) && !isIconGroup(i) && !isList(i)) {
        filtered.push(i);
      } else if (i !== t) {
        filteredOut.push(i);
      }
    } else if (isText(t)) {
      if (i !== t) {
        filtered.push(i);
      }
      // No else case here to avoid adding 't' to filteredOut
    } else {
      if (i !== t && !isHeading(i)) {
        filtered.push(i);
      } else if (i !== t) {
        filteredOut.push(i);
      }
    }
  });

  return { filtered, filteredOut };
};

// export const getToolbarActions = (t: TypeOfComponent) => {};
