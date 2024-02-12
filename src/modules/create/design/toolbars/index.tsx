import { type DraggableAttributes } from "@dnd-kit/core";
import { type SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import {
  type HTMLAttributes,
  type PropsWithChildren,
  MutableRefObject,
} from "react";
import cn from "classnames";

import { useComponentContext } from "../contexts/ComponentContext";
import { RiDragMove2Fill } from "react-icons/ri";
import { BUTTON_CN } from "./constants";
import { Tooltip } from "react-tooltip";
import { AddComponentPopover } from "./shared/AddComponentButton";
import { DeleteComponentButton } from "./shared/DeleteComponentButton";
import { PageBreakButton } from "./shared/PageBreakButton";

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

  const { id } = useComponentContext();

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
              <PageBreakButton />
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
