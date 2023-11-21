import { type DraggableAttributes } from "@dnd-kit/core";
import { type SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { type HTMLAttributes, type PropsWithChildren } from "react";
import { Tooltip } from "react-tooltip";
import { FaBold } from "react-icons/fa6";
import { FaItalic } from "react-icons/fa";
import cn from "classnames";
import { FaUnderline } from "react-icons/fa6";
import { FaChevronDown } from "react-icons/fa6";
import { IoHandLeftSharp } from "react-icons/io5";
import { IoAddCircleSharp } from "react-icons/io5";
import { Menu, MenuButton, MenuItem } from "@szhsin/react-menu";
import { RiDeleteBin6Line } from "react-icons/ri";

import { Button } from "~/components/ui/buttons/Button";
import { useDraftContext } from "~/modules/draft/DraftContext";
import { useComponentContext } from "../ComponentContext";
import { typedKeys } from "~/modules/draft/utils/common";

type EditorTooltipProps = PropsWithChildren<{
  dndRef: (node: HTMLElement | null) => void;
  listeners: SyntheticListenerMap | undefined;
  attributes: DraggableAttributes;
}> &
  HTMLAttributes<HTMLDivElement>;

const classNames = [
  {
    label: <FaBold />,
    className: "font-bold",
  },
  {
    label: <FaItalic />,
    className: "italic",
  },
  {
    label: <FaUnderline />,
    className: "underline",
  },
];

const SmChevron = () => <FaChevronDown size={8} />;

const active = "!bg-secondary-hover transition";

export const EditorTooltip = (props: EditorTooltipProps) => {
  const { dndRef, listeners, attributes, children, ...rest } = props;

  const c = useComponentContext();
  const {
    design,
    toggleClassName,
    add,
    changeType,
    remove,
    draftState: { CHANGE_DESIGN_FIRED },
  } = useDraftContext();
  const { intrinsic } = design;

  return (
    <div ref={dndRef} data-tooltip-id={c.id} {...rest}>
      {children}
      {!CHANGE_DESIGN_FIRED && (
        <Tooltip
          id={c.id}
          place="top"
          opacity={1}
          style={{ paddingInline: 10, zIndex: 9999 }}
          globalCloseEvents={{ scroll: true, clickOutsideAnchor: true }}
          clickable
          delayShow={400}
          delayHide={200}
          render={() => {
            return (
              <ul
                className="flex-center [&>li+li]:border-left w-full gap-3 rounded-md [&>li+li]:pl-3"
                data-html2canvas-ignore
              >
                {classNames.map(({ label, className }) => {
                  return (
                    !Boolean(c.isDecoration) && (
                      <li key={className}>
                        <Button
                          baseCn="navigation sm gap-2"
                          className={cn({
                            [active]: c.props.className.includes(className),
                          })}
                          onClick={() => toggleClassName(c, className)}
                        >
                          {label}
                        </Button>
                      </li>
                    )
                  );
                })}
                <li {...listeners} {...attributes}>
                  <Button baseCn="navigation sm gap-2">
                    <IoHandLeftSharp /> Drag
                  </Button>
                </li>
                <li>
                  <Menu
                    menuButton={
                      <MenuButton className="navigation sm common gap-2">
                        <IoAddCircleSharp /> <SmChevron />
                      </MenuButton>
                    }
                    gap={5}
                  >
                    {typedKeys(intrinsic).map((typeOfComponent) => (
                      <MenuItem
                        key={typeOfComponent}
                        onClick={() =>
                          add(
                            {
                              type: typeOfComponent,
                              ...intrinsic[typeOfComponent],
                            },
                            c
                          )
                        }
                      >
                        {typeOfComponent}
                      </MenuItem>
                    ))}
                  </Menu>
                </li>
                <li>
                  <Button
                    onClick={() => remove(c)}
                    className="sm common hover:bg-red"
                  >
                    <RiDeleteBin6Line />
                  </Button>
                </li>
                {!Boolean(c.isDecoration) && (
                  <li>
                    <Menu
                      menuButton={
                        <MenuButton className="navigation sm common gap-2">
                          Turn into <SmChevron />
                        </MenuButton>
                      }
                      gap={5}
                    >
                      {typedKeys(intrinsic).map((typeOfComponent) => (
                        <MenuItem
                          key={typeOfComponent}
                          onClick={() => changeType(c, typeOfComponent)}
                        >
                          {typeOfComponent}
                        </MenuItem>
                      ))}
                    </Menu>
                  </li>
                )}
              </ul>
            );
          }}
        />
      )}
    </div>
  );
};
