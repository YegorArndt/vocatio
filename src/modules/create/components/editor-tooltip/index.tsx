import { type DraggableAttributes } from "@dnd-kit/core";
import { type SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { type HTMLAttributes, type PropsWithChildren } from "react";
import { Tooltip } from "react-tooltip";
import { IoHandLeftSharp } from "react-icons/io5";

import { Button } from "~/components/ui/buttons/Button";
import type { DraftComponent } from "~/modules/draft/types";
import { useDraftContext } from "~/modules/draft/DraftContext";

type EditorTooltipProps = PropsWithChildren<{
  component: DraftComponent;
  dndRef: (node: HTMLElement | null) => void;
  listeners: SyntheticListenerMap | undefined;
  attributes: DraggableAttributes;
}> &
  HTMLAttributes<HTMLDivElement>;

export const EditorTooltip = (props: EditorTooltipProps) => {
  const { component, dndRef, listeners, attributes, children, ...rest } = props;
  const { id } = component;
  const {
    draftState: { CHANGE_DESIGN_FIRED },
  } = useDraftContext();

  return (
    <div ref={dndRef} data-tooltip-id={id} {...rest}>
      {children}
      {!CHANGE_DESIGN_FIRED && (
        <Tooltip
          id={id}
          place="top"
          opacity={1}
          style={{ paddingInline: 10, zIndex: 9999 }}
          globalCloseEvents={{ scroll: true, clickOutsideAnchor: true }}
          render={() => {
            return (
              <ul className="flex-center [&>li+li]:border-left w-full gap-3 rounded-md [&>li+li]:pl-3">
                <li {...listeners} {...attributes}>
                  <Button className="navigation sm gap-2">
                    <IoHandLeftSharp /> Drag
                  </Button>
                </li>
              </ul>
            );
          }}
          clickable
          delayShow={400}
          delayHide={200}
        />
      )}
    </div>
  );
};
