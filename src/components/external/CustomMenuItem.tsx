import cn from "classnames";
import { MenuItem, MenuItemProps } from "@szhsin/react-menu";

export const CustomMenuItem = (props: MenuItemProps) => {
  const { className, ...rest } = props;
  return (
    <MenuItem className={cn("flex-y gap-2", className as string)} {...rest} />
  );
};
