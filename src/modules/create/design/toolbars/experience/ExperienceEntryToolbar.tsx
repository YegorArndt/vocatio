import { type DraggableAttributes } from "@dnd-kit/core";
import { type SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import {
  type HTMLAttributes,
  type PropsWithChildren,
  MutableRefObject,
} from "react";
import { Tooltip } from "react-tooltip";

import { BUTTON_CN } from "../constants";
import { useComponentContext } from "../../contexts/ComponentContext";
import { Button } from "~/components/ui/buttons/Button";
import { BsPlusCircleDotted } from "react-icons/bs";
import { useCurrentDraft } from "~/hooks/useCurrentDraft";
import { SET_RIGHT_PANEL_VIEW_EVENT } from "~/modules/events";
import { PageBreakButton } from "../shared/PageBreakButton";
import { TooltipProvider } from "~/components/ui/external/Tooltip";
import { MoveComponentButton } from "../shared/MoveComponentButton";
import { BlurImage } from "~/components";

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
  const { currentDraft } = useCurrentDraft();

  const entry = currentDraft?.generatedExperience?.find((e) => e.id === c.id);
  const { place, image } = entry || {};

  const addBullets = () => {
    document.dispatchEvent(
      new CustomEvent(SET_RIGHT_PANEL_VIEW_EVENT, {
        detail: {
          view: "bullets",
          component: c,
        },
      })
    );
  };

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
                  <Button
                    frontIcon={<BsPlusCircleDotted />}
                    text="Add bullet points"
                    baseCn="flex-y"
                    className={BUTTON_CN}
                    onClick={addBullets}
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
