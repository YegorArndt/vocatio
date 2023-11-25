import { type DraggableAttributes } from "@dnd-kit/core";
import { type SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { Fragment, type HTMLAttributes, type PropsWithChildren } from "react";
import { Tooltip } from "react-tooltip";
import { FaBold } from "react-icons/fa6";
import { FaItalic } from "react-icons/fa";
import cn from "classnames";
import { FaUnderline } from "react-icons/fa6";
import { IoAddCircleSharp } from "react-icons/io5";
import {
  Menu,
  MenuButton,
  MenuHeader,
  MenuItem,
  SubMenu,
} from "@szhsin/react-menu";
import { RiDeleteBin6Line, RiDragMove2Fill } from "react-icons/ri";
import { IoTextSharp } from "react-icons/io5";
import { IoChevronUpOutline } from "react-icons/io5";
import { RxLetterCaseUppercase } from "react-icons/rx";

import { Button } from "~/components/ui/buttons/Button";
import { useDraftContext } from "~/modules/draft/DraftContext";
import { useComponentContext } from "../../ComponentContext";
import {
  isDecoration,
  isImage,
  isList,
  isTimeline,
  typedKeys,
} from "~/modules/draft/utils/common";
import { BsArrowsCollapse } from "react-icons/bs";
import {
  getDirection,
  getComponentNameByType,
  toAllowedTypes,
  getAddText,
} from "./utils";
import { mergeWithIntrinsic } from "~/modules/utils/mergeWithIntrinsic";
import { LuCopyPlus } from "react-icons/lu";

type ComponentToolbarProps = PropsWithChildren<{
  dndRef: (node: HTMLElement | null) => void;
  listeners: SyntheticListenerMap | undefined;
  attributes: DraggableAttributes;
  shouldHide: boolean;
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
    label: "Center",
    className: "text-center",
  },
  {
    icon: <RxLetterCaseUppercase />,
    label: "Upper",
    className: "uppercase",
  },
];

const SmChevron = (p: { menuDirection: "top" | "bottom" }) => (
  <IoChevronUpOutline
    size={8}
    style={{
      transform: p.menuDirection === "top" ? undefined : "rotate(180deg)",
    }}
  />
);

const active = "bg-gray transition";

export const ComponentToolbar = (props: ComponentToolbarProps) => {
  const { dndRef, listeners, attributes, children, shouldHide, ...rest } =
    props;
  const c = useComponentContext();
  const { type, id, sectionId } = c;
  const {
    design,
    toggleClassName,
    addNewComponent,
    changeComponentType,
    removeComponent,
  } = useDraftContext();
  const { intrinsic } = design;

  const menuDirection = getDirection(sectionId);

  const canEditText = !isDecoration(type) && !isTimeline(type) && !isList(type);

  const canDuplicate =
    !isTimeline(type) && !isDecoration(type) && !isList(type);

  const canTurnInto = !isDecoration(type) && !isTimeline(type);

  const canDelete = !isTimeline(type);

  return (
    <div ref={dndRef} data-tooltip-id={id} {...rest}>
      {children}
      {!isImage(type) && (
        <Tooltip
          id={id}
          place={isTimeline(type) ? "bottom" : "top"}
          opacity={shouldHide ? 0 : 1}
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
                {canEditText && (
                  <li>
                    <Menu
                      menuButton={
                        <MenuButton className="flex-center hover common-transition gap-2 hover:text-[#fff]">
                          <IoTextSharp />
                          <SmChevron menuDirection={menuDirection} />
                        </MenuButton>
                      }
                      transition
                      gap={5}
                      direction={menuDirection}
                    >
                      {classNames.map(({ icon, label, className }) => {
                        const m = mergeWithIntrinsic(c, design);

                        return (
                          <MenuItem
                            key={className}
                            className={cn("flex items-center gap-2", {
                              [active]: m.props.className.includes(className),
                            })}
                            onClick={() => toggleClassName(m, className)}
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
                    Move {getComponentNameByType(c.type, c.id)}
                    <RiDragMove2Fill />
                  </Button>
                </li>
                {canDuplicate && (
                  <li>
                    <Button
                      baseCn="hover hover:text-[#fff] flex-center gap-2 common-transition"
                      onClick={() => addNewComponent(c, c)}
                    >
                      Duplicate <LuCopyPlus />
                    </Button>
                  </li>
                )}
                <li>
                  <Menu
                    menuButton={
                      <MenuButton className="hover flex-center common-transition gap-2 hover:text-[#fff]">
                        {getAddText(c.type, c.id) ?? <IoAddCircleSharp />}
                        <SmChevron menuDirection={menuDirection} />
                      </MenuButton>
                    }
                    transition
                    gap={5}
                    direction={menuDirection}
                  >
                    {typedKeys(intrinsic).map((typeOfComponent) => {
                      if (isImage(typeOfComponent)) return;

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
                {canDelete && (
                  <li>
                    <Button
                      onClick={() => removeComponent(c)}
                      className="common flex-center gap-2 clr-secondary hover:bg-red hover:text-[#fff]"
                    >
                      <RiDeleteBin6Line />
                    </Button>
                  </li>
                )}
                {canTurnInto && (
                  <li>
                    <Menu
                      menuButton={
                        <MenuButton className="hover flex-center common-transition gap-2 hover:text-[#fff]">
                          Turn into <SmChevron menuDirection={menuDirection} />
                        </MenuButton>
                      }
                      transition
                      gap={5}
                      direction={menuDirection}
                    >
                      {Object.entries(toAllowedTypes(intrinsic, c.type)).map(
                        ([key, types], i) =>
                          i === 0 ? (
                            <Fragment key={key}>
                              <MenuHeader className="lowercase first-letter:capitalize">
                                Suggested
                              </MenuHeader>
                              {types.map((t) => (
                                <MenuItem
                                  key={t}
                                  onClick={() => changeComponentType(c, t)}
                                >
                                  {t}
                                </MenuItem>
                              ))}
                            </Fragment>
                          ) : (
                            types.length > 0 && (
                              <SubMenu label="Other" key={key}>
                                {types.map((typeOfComponent) => (
                                  <MenuItem
                                    key={typeOfComponent}
                                    onClick={() =>
                                      changeComponentType(c, typeOfComponent)
                                    }
                                  >
                                    {typeOfComponent}
                                  </MenuItem>
                                ))}
                              </SubMenu>
                            )
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
