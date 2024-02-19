import cn from "classnames";
import { MenuButton, MenuButtonProps } from "@szhsin/react-menu";
import { forwardRef } from "react";
import { BUTTON_CN } from "~/modules/create/design/base-components/toolbars/constants";

export const CustomMenuButton = forwardRef((props: MenuButtonProps, ref) => {
  const { className, ...rest } = props;

  return (
    <MenuButton
      className={cn("gap-2", BUTTON_CN, className as string)}
      ref={ref}
      {...rest}
    />
  );
});

CustomMenuButton.displayName = "CustomMenuButton";
