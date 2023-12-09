import { type DraggableAttributes } from "@dnd-kit/core";
import { type SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import {
  Fragment,
  useState,
  type HTMLAttributes,
  type PropsWithChildren,
  useCallback,
} from "react";
import { Tooltip } from "react-tooltip";
import { FaBold } from "react-icons/fa6";
import { FaItalic } from "react-icons/fa";
import cn from "classnames";
import { FaUnderline } from "react-icons/fa6";
import { IoAddCircleSharp } from "react-icons/io5";
import { Menu, MenuButton, MenuItem } from "@szhsin/react-menu";
import { RiDeleteBin6Line, RiDragMove2Fill } from "react-icons/ri";
import { IoTextSharp } from "react-icons/io5";
import { IoChevronUpOutline } from "react-icons/io5";
import { RxLetterCaseUppercase } from "react-icons/rx";
import { LuCopyPlus } from "react-icons/lu";
import { BsArrowsCollapse } from "react-icons/bs";

import { Button } from "~/components/ui/buttons/Button";
import { useDraftContext } from "~/modules/draft/DraftContext";
import { useComponentContext } from "../../ComponentContext";
import { isDecoration, isImage, typedKeys } from "~/modules/draft/utils/common";
import { getDirection, getMenuProps } from "./utils";
import { mergeWithIntrinsic } from "~/modules/utils/mergeWithIntrinsic";
import { useCrudContext } from "../../DndProvider";
import { debounce } from "lodash-es";

const { log } = console;

type ComponentToolbarProps = PropsWithChildren<{
  dndRef: (node: HTMLElement | null) => void;
  listeners: SyntheticListenerMap | undefined;
  attributes: DraggableAttributes;
  decorated?: boolean;
  index: number;
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
  const {
    dndRef,
    listeners,
    attributes,
    children,
    shouldHide,
    decorated,
    index,
    ...rest
  } = props;
  const [isTyping, setIsTyping] = useState(false);
  const c = useComponentContext();
  const {
    addComponent,
    removeComponent,
    toggleClassName,
    changeComponentType,
  } = useCrudContext();
  const { design } = useDraftContext();

  const { type, id, sectionId } = c;
  const { intrinsic } = design;

  const menuDirection = getDirection(sectionId);

  const canEditText = !isDecoration(type);
  const canDuplicate = !isDecoration(type);
  const canTurnInto = !isDecoration(type);

  const debouncedOnKeyDown = useCallback(
    debounce(() => {
      setIsTyping(true);
    }, 5000),
    []
  );

  const debouncedOnKeyUp = useCallback(
    debounce(() => {
      setIsTyping(false);
    }, 5000),
    []
  );

  return (
    <div
      ref={dndRef}
      data-tooltip-id={id}
      className={cn("relative", {
        "pl-6": decorated,
      })}
      onKeyDown={() => {
        if (!isTyping) setIsTyping(true);
        debouncedOnKeyDown();
      }}
      onKeyUp={debouncedOnKeyUp}
      {...rest}
    >
      {decorated && (
        <Fragment>
          <div className="z-1 absolute left-0 top-2 h-3 w-3 rounded-full border-2 border-solid border-black bg-white" />
          <div className="absolute left-[.36rem] top-2 h-full w-[0.5px] bg-black" />
        </Fragment>
      )}
      {children}
      <Tooltip
        id={id}
        place="top"
        hidden={isTyping}
        style={{ paddingInline: 10 }}
        opacity={1}
        globalCloseEvents={{ clickOutsideAnchor: true }}
        className={cn("z-tooltip h-[40px] !p-0 [&>*]:h-full", {
          hidden: isTyping,
        })}
        clickable
        openOnClick
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
                    portal
                    {...getMenuProps(menuDirection)}
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
                  Move {c?.props?.tooltip} <RiDragMove2Fill />
                </Button>
              </li>
              {canDuplicate && (
                <li>
                  <Button
                    baseCn="hover hover:text-[#fff] flex-center gap-2 common-transition"
                    onClick={() => addComponent(c)}
                  >
                    <LuCopyPlus />
                  </Button>
                </li>
              )}
              <li>
                <Menu
                  menuButton={
                    <MenuButton className="hover flex-center common-transition gap-2 hover:text-[#fff]">
                      <IoAddCircleSharp />
                      <SmChevron menuDirection={menuDirection} />
                    </MenuButton>
                  }
                  portal
                  {...getMenuProps(menuDirection)}
                >
                  {typedKeys(intrinsic).map((typeOfComponent) => {
                    if (isImage(typeOfComponent)) return;

                    return (
                      <MenuItem
                        key={typeOfComponent}
                        onClick={() =>
                          addComponent({ ...c, type: typeOfComponent })
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
                  <RiDeleteBin6Line />
                </Button>
              </li>
              {canTurnInto && (
                <li>
                  <Menu
                    menuButton={
                      <MenuButton className="hover flex-center common-transition gap-2 hover:text-[#fff]">
                        Turn into <SmChevron menuDirection={menuDirection} />
                      </MenuButton>
                    }
                    portal
                    {...getMenuProps(menuDirection)}
                  ></Menu>
                </li>
              )}
            </ul>
          );
        }}
      />
    </div>
  );
};
