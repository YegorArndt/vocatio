import { type DraggableAttributes } from "@dnd-kit/core";
import { type SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import {
  type HTMLAttributes,
  type PropsWithChildren,
  MutableRefObject,
} from "react";
import { Tooltip } from "react-tooltip";

import { useComponentContext } from "../../../contexts/ComponentContext";
import { useGeneratedData } from "~/hooks/useGeneratedData";
import { PageBreakButton } from "../shared/PageBreakButton";
import { TooltipProvider } from "~/components/ui/external/Tooltip";
import { MoveComponentButton } from "../shared/MoveComponentButton";
import { BlurImage } from "~/components";
import { AddBulletPointsPopover } from "./AddBulletPointsPopover";

const { log } = console;

type ToolbarProps = PropsWithChildren<{
  dndRef: (node: HTMLElement | null) => void;
  listeners: SyntheticListenerMap | undefined;
  attributes: DraggableAttributes;
  className?: string;
  node: MutableRefObject<HTMLElement | null>;
}> &
  HTMLAttributes<HTMLLIElement>;

export const ExperienceEntryToolbar = (props: ToolbarProps) => {
  const { dndRef, listeners, attributes, children, className, node, ...rest } =
    props;
  const c = useComponentContext();
  const { generated } = useGeneratedData();

  const entry = generated?.generatedExperience?.find((e) => e.id === c.id);
  const { place, image } = entry || {};

  const entryHeader = place || "entry";

  return (
    <li ref={dndRef} data-tooltip-id={c.id} className={className} {...rest}>
      {children}
      <Tooltip
        id={c.id}
        globalCloseEvents={{ clickOutsideAnchor: true }}
        className="z-tooltip !p-0"
        clickable
        openOnClick
        place="right"
        delayShow={400}
        delayHide={200}
        data-html2canvas-ignore
        render={() => {
          return (
            <div className="flex flex-col" data-html2canvas-ignore>
              <header className="flex-y border-bottom gap-2 p-2 text-lg">
                <BlurImage src={image} /> {entryHeader}
              </header>
              <section className="flex-center">
                <TooltipProvider>
                  <PageBreakButton />
                  <MoveComponentButton
                    listeners={listeners}
                    attributes={attributes}
                  />
                  <AddBulletPointsPopover />
                </TooltipProvider>
              </section>
            </div>
          );
        }}
      />
    </li>
  );
};
