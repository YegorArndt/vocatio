// import { ImPageBreak } from "react-icons/im";
import { ImPageBreak } from "react-icons/im";
import { type DraggableAttributes } from "@dnd-kit/core";
import { type SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import {
  useState,
  type HTMLAttributes,
  type PropsWithChildren,
  useCallback,
  MutableRefObject,
  useEffect,
} from "react";
import { Tooltip } from "react-tooltip";
import cn from "classnames";
import { MenuDivider, MenuHeader, SubMenu } from "@szhsin/react-menu";
import { RiDeleteBin6Line, RiDragMove2Fill } from "react-icons/ri";
import { IoTextSharp } from "react-icons/io5";
import { LuCopyPlus } from "react-icons/lu";
import { BsArrowsCollapse, BsArrowsExpand } from "react-icons/bs";

import { useDraftContext } from "~/modules/draft/DraftContext";
import { useComponentContext } from "../components/ComponentContext";
import {
  isDecoration,
  isEntries,
  isImage,
  isText,
  typedKeys,
} from "~/modules/draft/utils/common";
import { useCrudContext } from "../components/DndProvider";
import { debounce, startCase } from "lodash-es";
import { BlurImage } from "~/components";
import { SlMagicWand } from "react-icons/sl";
import { Textarea } from "~/components/ui/inputs/Textarea";
import { TfiWrite } from "react-icons/tfi";
import { BUTTON_CN, textClassNames } from "./constants";
import { CustomMenu } from "~/components/ui/external/CustomMenu";
import { CustomMenuButton } from "~/components/ui/external/CustomMenuButton";
import { CustomMenuItem } from "~/components/ui/external/CustomMenuItem";
import { mergeWithIntrinsic } from "../utils/mergeWithIntrinsic";
import { useAiMethods } from "./useAiMethods";
import { LiaToolsSolid } from "react-icons/lia";
import { CiCirclePlus } from "react-icons/ci";
import { HiOutlineArrowPath } from "react-icons/hi2";
import { Badge } from "~/components/ui/external/Badge";
import { Button } from "~/components/ui/buttons/Button";

const { log } = console;

type ToolstripProps = PropsWithChildren<{
  dndRef: (node: HTMLElement | null) => void;
  listeners: SyntheticListenerMap | undefined;
  attributes: DraggableAttributes;
  className?: string;
  node: MutableRefObject<HTMLElement | null>;
}> &
  HTMLAttributes<HTMLLIElement>;

export const Toolstrip = (props: ToolstripProps) => {
  const { dndRef, listeners, attributes, children, className, node, ...rest } =
    props;
  const [isTyping, setIsTyping] = useState(false);

  const [element, setElement] = useState<HTMLElement | null>(null);

  const c = useComponentContext();

  const { addComponent, removeComponent, toggleClassName, turnInto } =
    useCrudContext();

  const { design } = useDraftContext();

  const { control, watch, adjust, condense, convert, elaborate, custom } =
    useAiMethods();

  const { type, id } = c;
  const { intrinsic } = design;

  const canEditText = !isDecoration(type) && !isEntries(type);
  const canTurnInto = !isDecoration(type) && !isEntries(type);
  const canGpt = isText(type);

  /**
   * Hide tooltips on typing.
   */
  const debouncedOnKeyDown = useCallback(
    debounce(() => {
      setIsTyping(true);
    }, 1000),
    []
  );
  const debouncedOnKeyUp = useCallback(
    debounce(() => {
      setIsTyping(false);
    }, 2000),
    []
  );

  useEffect(() => {
    if (!element) return;
    // Reverse margin
    element.style.marginTop = "0px";

    // Reverse ball margin
    const splitWord = id.includes("place") ? "place" : "title";

    const numId = id.split(`${splitWord}-`)[1];

    const ball = document.getElementById(`ball-${numId}`);

    if (ball) {
      ball.style.marginTop = "0px";
    }
  }, [design.name]);

  return (
    <li
      ref={dndRef}
      data-tooltip-id={id}
      className={cn("toolstrip", className)}
      onKeyDown={() => {
        if (!isTyping) setIsTyping(true);
        debouncedOnKeyDown();
      }}
      onKeyUp={debouncedOnKeyUp}
      {...rest}
    >
      {children}
      <Tooltip
        id={id}
        hidden={isTyping}
        globalCloseEvents={{ clickOutsideAnchor: true }}
        className={cn("!z-tooltip !p-0 [&>*]:h-full", {
          hidden: isTyping,
          "translate-y-[50px] transform": c.type === "entries",
        })}
        clickable
        openOnClick
        place={c.type === "context" ? "top" : "left"}
        delayShow={400}
        delayHide={200}
        data-html2canvas-ignore
        render={() => {
          return (
            <div className="flex-center gap-1" data-html2canvas-ignore>
              {["place", "title"].some((s) => id.includes(s)) && (
                <Button
                  className={cn(BUTTON_CN, "p-2", {
                    "bg-hover": !!element,
                  })}
                  onClick={(e) => {
                    if (!document) return;

                    const { currentTarget } = e;
                    const correspondingElement = currentTarget.closest("ul");

                    if (!correspondingElement) return;

                    // Calculate the distance between the Button and page-break coordinates
                    const buttonRect = currentTarget.getBoundingClientRect();
                    const pageBreakRect = document
                      .querySelector(".page-break")
                      ?.getBoundingClientRect();

                    if (!pageBreakRect) return;

                    const distance = pageBreakRect.top - buttonRect.bottom;

                    // Smoothly animate the corresponding element down by the calculated distance
                    correspondingElement.style.transition = "margin 0.5s ease";

                    const splitWord = id.includes("place") ? "place" : "title";

                    const numId = id.split(`${splitWord}-`)[1];

                    const ball = document.getElementById(`ball-${numId}`);

                    if (ball) {
                      ball.style.transition = "margin 0.5s ease";
                      ball.style.marginTop = element
                        ? "0px"
                        : `${distance + 100}px`;
                    }

                    correspondingElement.style.marginTop = element
                      ? "0px"
                      : `${distance + 100}px`;
                    setElement(element ? null : correspondingElement);
                  }}
                >
                  <ImPageBreak />{" "}
                </Button>
              )}
              <span
                {...listeners}
                {...attributes}
                className={cn(BUTTON_CN, "p-2")}
              >
                <RiDragMove2Fill
                  size={
                    c.type === "context" ? 30 : c.type === "entries" ? 23 : 18
                  }
                />
              </span>
              <CustomMenu
                menuButton={
                  <CustomMenuButton className="p-2">
                    <LiaToolsSolid
                      size={
                        c.type === "context"
                          ? 35
                          : c.type === "entries"
                          ? 20
                          : 10
                      }
                    />
                  </CustomMenuButton>
                }
                className="flex-center size-full !z-tooltip rounded-md clr-secondary"
                hidden={isTyping}
              >
                <MenuHeader className="normal-case">
                  {c.props.tooltip ||
                    startCase(/\d/.test(c.id) ? c.type : c.id)}{" "}
                  Tools
                </MenuHeader>
                <MenuDivider />
                {canEditText && (
                  <SubMenu
                    label={
                      <span className="flex-y gap-2">
                        <IoTextSharp /> Text style
                      </span>
                    }
                  >
                    {textClassNames.map(({ icon, label, className }) => {
                      const m = mergeWithIntrinsic(c, design);

                      return (
                        <CustomMenuItem
                          key={className}
                          onClick={() => toggleClassName(m, className)}
                          className={cn({
                            "bg-gray transition":
                              m.props.className.includes(className),
                          })}
                        >
                          {icon}
                          {label}
                        </CustomMenuItem>
                      );
                    })}
                  </SubMenu>
                )}
                <CustomMenuItem
                  onClick={() => addComponent(c)}
                  className="flex-y gap-2"
                >
                  <LuCopyPlus /> Duplicate
                </CustomMenuItem>
                <SubMenu
                  label={
                    <span className="flex-y gap-2">
                      <CiCirclePlus />
                      Add below
                    </span>
                  }
                >
                  <MenuHeader className="normal-case">
                    Choose component
                  </MenuHeader>
                  <MenuDivider />
                  {typedKeys(intrinsic).map((typeOfComponent) => {
                    if (isImage(typeOfComponent)) return;

                    return (
                      <CustomMenuItem
                        key={typeOfComponent}
                        onClick={() =>
                          addComponent({
                            ...c,
                            type: typeOfComponent,
                            sectionId: c.sectionId,
                          })
                        }
                      >
                        <BlurImage
                          src={`/intrinsic/${typeOfComponent}.png`}
                          height={50}
                          width={50}
                          alt=""
                        />
                        {startCase(typeOfComponent)}
                      </CustomMenuItem>
                    );
                  })}
                </SubMenu>
                <CustomMenuItem
                  onClick={() => removeComponent(c)}
                  className="flex-y gap-2"
                >
                  <RiDeleteBin6Line /> Delete {c?.props?.tooltip}
                </CustomMenuItem>
                {canTurnInto && (
                  <SubMenu
                    label={
                      <span className="flex-y gap-2">
                        <HiOutlineArrowPath />
                        Turn into
                      </span>
                    }
                  >
                    <MenuHeader className="normal-case">
                      Choose component
                    </MenuHeader>
                    <MenuDivider />
                    {typedKeys(intrinsic).map((typeOfComponent) => {
                      const cantTurn =
                        typeOfComponent === type ||
                        isDecoration(typeOfComponent);

                      if (cantTurn) return;

                      return (
                        <CustomMenuItem
                          key={typeOfComponent}
                          onClick={() => turnInto(c, typeOfComponent)}
                        >
                          <BlurImage
                            src={`/intrinsic/${typeOfComponent}.png`}
                            height={50}
                            width={50}
                            alt=""
                          />
                          {startCase(typeOfComponent)}
                        </CustomMenuItem>
                      );
                    })}
                  </SubMenu>
                )}
                {canGpt && (
                  <SubMenu
                    label={
                      <span className="flex-y gap-2">
                        <BlurImage
                          src="/gpt-logo.jpg"
                          height={25}
                          width={25}
                          className="rounded-full"
                        />
                        AI tools
                      </span>
                    }
                  >
                    <MenuHeader className="flex-center">
                      <Badge variant="outline">Beta</Badge>
                    </MenuHeader>
                    <CustomMenuItem onClick={() => void adjust()}>
                      <SlMagicWand /> Adjust to vacancy
                    </CustomMenuItem>
                    <CustomMenuItem onClick={() => void condense()}>
                      <BsArrowsCollapse /> Condense
                    </CustomMenuItem>
                    <CustomMenuItem onClick={elaborate}>
                      <BsArrowsExpand /> Elaborate
                    </CustomMenuItem>
                    <MenuDivider />
                    <SubMenu
                      label={
                        <span className="flex-y gap-2">
                          <TfiWrite />
                          Rewrite...
                        </span>
                      }
                    >
                      <CustomMenuItem
                        onClick={() => void convert("bulletPoints")}
                      >
                        <BsArrowsCollapse /> To a bullet list
                      </CustomMenuItem>
                      <CustomMenuItem onClick={() => void convert("text")}>
                        <BsArrowsExpand /> To a thorough description
                      </CustomMenuItem>
                    </SubMenu>
                    <MenuDivider />
                    <MenuHeader>Or</MenuHeader>
                    <Textarea
                      name="custom"
                      control={control}
                      placeholder="Your command"
                      className="my-2 ml-4 !w-[85%] border !bg-white !px-4 [&>*]:!cursor-[black] [&>*]:!clr-black"
                      onClickCapture={(e) => e.stopPropagation()}
                    />
                    <CustomMenuItem onClick={(e) => void custom(e)}>
                      <BlurImage
                        src="/gpt-logo.jpg"
                        height={20}
                        width={20}
                        alt=""
                      />
                      Apply
                    </CustomMenuItem>
                  </SubMenu>
                )}
              </CustomMenu>
            </div>
          );
        }}
      />
    </li>
  );
};
