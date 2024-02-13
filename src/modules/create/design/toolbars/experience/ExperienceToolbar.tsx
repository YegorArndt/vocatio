import { type DraggableAttributes } from "@dnd-kit/core";
import { type SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import {
  type HTMLAttributes,
  type PropsWithChildren,
  MutableRefObject,
} from "react";
import cn from "classnames";
import { Tooltip } from "react-tooltip";

import { AddExperiencePopover } from "./AddExperiencePopover";
import { PageBreakButton } from "../shared/PageBreakButton";
import { TooltipProvider } from "~/components/ui/external/Tooltip";
import { MoveComponentButton } from "../shared/MoveComponentButton";

const { log } = console;

type ToolbarProps = PropsWithChildren<{
  dndRef: (node: HTMLElement | null) => void;
  listeners: SyntheticListenerMap | undefined;
  attributes: DraggableAttributes;
  className?: string;
  node: MutableRefObject<HTMLElement | null>;
}> &
  HTMLAttributes<HTMLLIElement>;

export const ExperienceToolbar = (props: ToolbarProps) => {
  const { dndRef, listeners, attributes, children, className, node, ...rest } =
    props;

  return (
    <li
      ref={dndRef}
      data-tooltip-id="experience"
      className={className}
      {...rest}
    >
      {children}
      <Tooltip
        id="experience"
        globalCloseEvents={{ clickOutsideAnchor: true }}
        className={cn("!z-tooltip -translate-y-[50px] transform !p-0")}
        clickable
        openOnClick
        place="top"
        delayShow={400}
        delayHide={200}
        data-html2canvas-ignore
        render={() => {
          return (
            <div className="flex flex-col" data-html2canvas-ignore>
              <header className="flex-y border-bottom gap-2 p-2 text-lg">
                Experience section
              </header>
              <div className="flex-center">
                <TooltipProvider>
                  <PageBreakButton />
                  <MoveComponentButton
                    listeners={listeners}
                    attributes={attributes}
                  />
                  <AddExperiencePopover />
                </TooltipProvider>
              </div>
            </div>
          );
        }}
      />
    </li>
  );
};
