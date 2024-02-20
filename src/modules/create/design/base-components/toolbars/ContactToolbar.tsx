import { type DraggableAttributes } from "@dnd-kit/core";
import { type SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import {
  type HTMLAttributes,
  type PropsWithChildren,
  MutableRefObject,
} from "react";

import { Tooltip } from "react-tooltip";
import { TooltipProvider } from "~/components/ui/external/Tooltip";
import { MoveComponentButton } from "./shared/MoveComponentButton";
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

export const ContactToolbar = (props: ToolbarProps) => {
  const { dndRef, listeners, attributes, children, className, node, ...rest } =
    props;

  return (
    <li ref={dndRef} data-tooltip-id="skills" className={className} {...rest}>
      {children}
      <Tooltip
        id="skills"
        globalCloseEvents={{ clickOutsideAnchor: true }}
        className="z-tooltip -translate-y-[50px] transform !p-0"
        clickable
        openOnClick
        place="top"
        delayShow={400}
        delayHide={200}
        data-html2canvas-ignore
        render={() => {
          return (
            <div className="flex-center gap-1" data-html2canvas-ignore>
              <TooltipProvider>
                <PageBreakButton />
                <MoveComponentButton
                  listeners={listeners}
                  attributes={attributes}
                />
              </TooltipProvider>
            </div>
          );
        }}
      />
    </li>
  );
};
