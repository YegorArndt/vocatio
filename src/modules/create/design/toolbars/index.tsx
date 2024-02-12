import { type DraggableAttributes } from "@dnd-kit/core";
import { type SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import {
  useState,
  type HTMLAttributes,
  type PropsWithChildren,
  MutableRefObject,
  useEffect,
} from "react";
import cn from "classnames";

import { useComponentContext } from "../contexts/ComponentContext";
import { useDesignContext } from "~/modules/create/design/contexts/DesignContext";
import { RiDragMove2Fill } from "react-icons/ri";
import { Button } from "~/components/ui/buttons/Button";
import { BUTTON_CN } from "./constants";
import { Tooltip } from "react-tooltip";
import { TbPageBreak } from "react-icons/tb";
import { useCrudContext } from "../base-components/dnd/crud";
import { AddComponentPopover } from "./shared/AddComponentButton";
import { DeleteComponentButton } from "./shared/DeleteComponentButton";

const { log } = console;

type ToolbarProps = PropsWithChildren<{
  dndRef: (node: HTMLElement | null) => void;
  listeners: SyntheticListenerMap | undefined;
  attributes: DraggableAttributes;
  className?: string;
  node: MutableRefObject<HTMLElement | null>;
}> &
  HTMLAttributes<HTMLLIElement>;

export const Toolbar = (props: ToolbarProps) => {
  const { dndRef, listeners, attributes, children, className, node, ...rest } =
    props;

  const [element, setElement] = useState<HTMLElement | null>(null);

  const { addComponent } = useCrudContext();

  const c = useComponentContext();

  const { design } = useDesignContext();

  const { type, id } = c;
  const { baseComponents } = design;

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
      className={cn("toolbar", className)}
      {...rest}
    >
      {children}
      <Tooltip
        id={id}
        globalCloseEvents={{ clickOutsideAnchor: true }}
        className={cn("!z-tooltip !p-0 [&>*]:h-full", {})}
        clickable
        openOnClick
        place="top"
        delayShow={400}
        delayHide={200}
        data-html2canvas-ignore
        render={() => {
          return (
            <div className="flex-center gap-1" data-html2canvas-ignore>
              {["place", "title"].some((s) => id?.includes(s)) && (
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
                        : `${distance + 50}px`;
                    }

                    correspondingElement.style.marginTop = element
                      ? "0px"
                      : `${distance + 50}px`;
                    setElement(element ? null : correspondingElement);
                  }}
                >
                  <TbPageBreak />
                </Button>
              )}
              <span
                {...listeners}
                {...attributes}
                className={cn(BUTTON_CN, "p-2")}
              >
                <RiDragMove2Fill size={20} />
              </span>
              <AddComponentPopover />
              <DeleteComponentButton />
            </div>
          );
        }}
      />
    </li>
  );
};
