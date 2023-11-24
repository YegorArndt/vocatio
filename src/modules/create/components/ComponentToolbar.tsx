import { type DraggableAttributes } from "@dnd-kit/core";
import { type SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { type HTMLAttributes, type PropsWithChildren } from "react";
import { Tooltip } from "react-tooltip";
import { FaBold } from "react-icons/fa6";
import { FaItalic } from "react-icons/fa";
import cn from "classnames";
import { FaUnderline } from "react-icons/fa6";
import { FaChevronDown } from "react-icons/fa6";
import { IoAddCircleSharp } from "react-icons/io5";
import { Menu, MenuButton, MenuItem } from "@szhsin/react-menu";
import { RiDeleteBin6Line, RiDragMove2Fill } from "react-icons/ri";

import { Button } from "~/components/ui/buttons/Button";
import { useDraftContext } from "~/modules/draft/DraftContext";
import { useComponentContext } from "../ComponentContext";
import {
  isDecoration,
  isTimeline,
  typedKeys,
} from "~/modules/draft/utils/common";
import { BsArrowsCollapse } from "react-icons/bs";

type ComponentToolbarProps = PropsWithChildren<{
  dndRef: (node: HTMLElement | null) => void;
  listeners: SyntheticListenerMap | undefined;
  attributes: DraggableAttributes;
}> &
  HTMLAttributes<HTMLDivElement>;

const classNames = [
  {
    icon: <FaBold />,
    label: "Bold",
    className: "font-bold",
  },
  {
    icon: <FaItalic />,
    label: "Italic",
    className: "italic",
  },
  {
    icon: <FaUnderline />,
    label: "Underline",
    className: "underline",
  },
  {
    icon: <BsArrowsCollapse style={{ transform: "rotate(90deg)" }} />,
    label: "Push to center",
    className: "text-center",
  },
];

const SmChevron = () => <FaChevronDown size={8} />;

const active = "bg-gray transition";

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
          className="h-[40px] !p-0 [&>*]:h-full"
          clickable
          delayShow={400}
          delayHide={200}
          render={() => {
            return (
              <ul
                className="flex-center [&>li+li]:border-left h-full w-full rounded-md clr-secondary [&_li]:h-full [&_li_button]:h-full [&_li_button]:px-3"
                data-html2canvas-ignore
              >
                {!isDecoration(c.type) && !isTimeline(c.type) && (
                  <li>
                    <Menu
                      menuButton={
                        <MenuButton className="flex-center hover common-transition gap-2 hover:text-[#fff]">
                          A <SmChevron />
                        </MenuButton>
                      }
                      transition
                      gap={5}
                    >
                      {classNames.map(({ icon, label, className }) => {
                        return (
                          <MenuItem
                            key={className}
                            className={cn("flex items-center gap-2", {
                              [active]: c.props?.className?.includes(className),
                            })}
                            onClick={() => toggleClassName(c, className)}
                          >
                            {icon} {label}
                          </MenuItem>
                        );
                      })}
                    </Menu>
                  </li>
                )}
                <li {...listeners} {...attributes}>
                  <Button baseCn="hover hover:text-[#fff] flex-center gap-2 common-transition">
                    {isTimeline(c.type) ? "Move timeline" : "Move"}
                    <RiDragMove2Fill />
                  </Button>
                </li>
                <li>
                  <Menu
                    menuButton={
                      <MenuButton className="hover flex-center common-transition gap-2 hover:text-[#fff]">
                        {isTimeline(c.type) ? (
                          "Add after timeline"
                        ) : (
                          <IoAddCircleSharp />
                        )}
                        <SmChevron />
                      </MenuButton>
                    }
                    transition
                    gap={5}
                  >
                    {typedKeys(intrinsic).map((typeOfComponent) => {
                      return (
                        <MenuItem
                          key={typeOfComponent}
                          onClick={() =>
                            addNewComponent(
                              {
                                id: "",
                                type: typeOfComponent,
                              },
                              c
                            )
                          }
                        >
                          {typeOfComponent}
                        </MenuItem>
                      );
                    })}
                  </Menu>
                </li>
                <li>
                  <Button
                    onClick={() => removeComponent(c)}
                    className="common flex-center gap-2 clr-secondary hover:bg-red hover:text-[#fff]"
                  >
                    {isTimeline(c.type) ? "Delete entire timeline" : ""}
                    <RiDeleteBin6Line />
                  </Button>
                </li>
                {!isDecoration(c.type) && !isTimeline(c.type) && (
                  <li>
                    <Menu
                      menuButton={
                        <MenuButton className="hover flex-center common-transition gap-2 hover:text-[#fff]">
                          Turn into <SmChevron />
                        </MenuButton>
                      }
                      transition
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
