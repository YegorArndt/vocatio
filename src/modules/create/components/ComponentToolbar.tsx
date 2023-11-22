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
import { HiOutlineArrowUturnDown } from "react-icons/hi2";

import { Button } from "~/components/ui/buttons/Button";
import { useDraftContext } from "~/modules/draft/DraftContext";
import { useComponentContext } from "../ComponentContext";
import {
  isDecoration,
  isTimeline,
  typedKeys,
} from "~/modules/draft/utils/common";

type ComponentToolbarProps = PropsWithChildren<{
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

export const ComponentToolbar = (props: ComponentToolbarProps) => {
  const { dndRef, listeners, attributes, children, ...rest } = props;
  const c = useComponentContext();
  const {
    design,
    toggleClassName,
    addNewComponent,
    changeComponentType,
    removeComponent,
    draftState: { CHANGE_DESIGN_FIRED },
  } = useDraftContext();
  const { intrinsic } = design;

  return (
    <div ref={dndRef} data-tooltip-id={c.id} {...rest}>
      {children}
      {!CHANGE_DESIGN_FIRED && (
        <Tooltip
          id={c.id}
          place={isTimeline(c.type) ? "bottom" : "top"}
          opacity={1}
          style={{ paddingInline: 10, zIndex: 9999 }}
          globalCloseEvents={{ clickOutsideAnchor: true }}
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
                    !isDecoration(c.type) &&
                    !isTimeline(c.type) && (
                      <li key={className}>
                        <Button
                          baseCn="navigation sm gap-2"
                          className={cn({
                            [active]: c.props?.className?.includes(className),
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
                  <Button baseCn="navigation sm">
                    <IoHandLeftSharp />
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
                          addNewComponent(
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
                    onClick={() => removeComponent(c)}
                    className="sm common hover:bg-red"
                  >
                    <RiDeleteBin6Line />
                  </Button>
                </li>
                {!isDecoration(c.type) && !isTimeline(c.type) && (
                  <li>
                    <Menu
                      menuButton={
                        <MenuButton className="navigation sm common gap-2">
                          <HiOutlineArrowUturnDown /> <SmChevron />
                        </MenuButton>
                      }
                      gap={5}
                    >
                      {typedKeys(intrinsic).map(
                        (typeOfComponent) =>
                          !isDecoration(typeOfComponent) && (
                            <MenuItem
                              key={typeOfComponent}
                              onClick={() =>
                                changeComponentType(c, typeOfComponent)
                              }
                            >
                              {typeOfComponent}
                            </MenuItem>
                          )
                      )}
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
