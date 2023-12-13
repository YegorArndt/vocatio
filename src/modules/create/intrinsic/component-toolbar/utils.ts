import { MenuProps } from "@szhsin/react-menu";
import { SectionId } from "~/modules/draft/types/sections";

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
