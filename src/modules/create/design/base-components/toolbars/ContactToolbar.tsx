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
    <li ref={dndRef} data-tooltip-id="contact" className={className} {...rest}>
      {children}
      <Tooltip
        id="contact"
        globalCloseEvents={{ clickOutsideAnchor: true }}
        className="z-tooltip -translate-y-[50px] transform !p-0"
        clickable
        positionStrategy="fixed"
        openOnClick
        delayShow={400}
        delayHide={200}
        data-html2canvas-ignore
        render={() => {
          return (
            <div data-html2canvas-ignore>
              <header className="flex-y border-bottom gap-2 p-2 text-lg">
                Contact section
              </header>
              <section className="flex-center gap-1">
                <TooltipProvider>
                  <PageBreakButton />
                  <MoveComponentButton
                    listeners={listeners}
                    attributes={attributes}
                  />
                </TooltipProvider>
              </section>
            </div>
          );
        }}
      />
    </li>
  );
};
