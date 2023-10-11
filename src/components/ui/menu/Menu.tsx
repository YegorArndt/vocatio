import {
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuProps as MP,
} from "@szhsin/react-menu";
import cn from "classnames";
import {
  Children,
  Fragment,
  type PropsWithChildren,
  type ReactNode,
} from "react";

type Dropdown = Partial<MP> & {
  triggerChildren?: ReactNode;
  triggerClassName?: string;
  triggerClassNameOnOpen?: string;
  triggerClassNameOnClose?: string;
  dropdownItemClassName?: string;
  dropdownClassName?: string;
  dividersAfter?: number[];
  itemClassName?: Record<number, string>;
};

export const Dropdown = (props: PropsWithChildren<Dropdown>) => {
  const {
    children,
    dropdownClassName,
    triggerChildren,
    triggerClassName,
    triggerClassNameOnOpen,
    triggerClassNameOnClose,
    dropdownItemClassName,
    itemClassName,
    dividersAfter,
    ...other
  } = props;

  return (
    <Menu
      // @ts-ignore
      menuButton={({ open }) => (
        <MenuButton
          className={cn(triggerClassName, {
            // @ts-ignore
            [triggerClassNameOnOpen]: open,
            // @ts-ignore
            [triggerClassNameOnClose]: !open,
          })}
        >
          {triggerChildren}
        </MenuButton>
      )}
      transition
      direction="left"
      gap={10}
      menuClassName={cn(
        "bg-secondary rounded-sm shadow-lg py-[6px] shadow-[rgba(55, 53, 47, 0.09) 0px -1px 0px]",
        dropdownClassName
      )}
      {...other}
    >
      {Children.map(children, (child, index) => {
        return (
          <Fragment key={index}>
            <MenuItem
              className={cn(
                dropdownItemClassName,
                "px-[10px] py-[4px] text-capture",
                itemClassName?.[index]
              )}
            >
              {child}
            </MenuItem>
            {dividersAfter?.includes(index) && <MenuDivider />}
          </Fragment>
        );
      })}
    </Menu>
  );
};
