import cn from "classnames";
import { Menu, MenuProps } from "@szhsin/react-menu";

export const CustomMenu = (props: MenuProps) => {
  const { menuClassName, ...rest } = props;
  return (
    <Menu
      gap={5}
      transition
      menuClassName={cn("z-dropdown", menuClassName as string)}
      portal
      {...rest}
    />
  );
};
