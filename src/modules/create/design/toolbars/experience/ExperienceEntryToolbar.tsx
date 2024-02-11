import { type DraggableAttributes } from "@dnd-kit/core";
import { type SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import {
  type HTMLAttributes,
  type PropsWithChildren,
  MutableRefObject,
} from "react";
import cn from "classnames";
import { Tooltip } from "react-tooltip";
import { RiDragMove2Fill } from "react-icons/ri";

import { BUTTON_CN } from "../constants";
import { useComponentContext } from "../../contexts/ComponentContext";
import { Button } from "~/components/ui/buttons/Button";
import { BsPlusCircleDotted } from "react-icons/bs";
import { useCurrentDraft } from "~/hooks/useCurrentDraft";
import { BlurImage } from "~/components";
import { SET_RIGHT_PANEL_VIEW_EVENT } from "~/modules/constants";

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

  return (
    <li
      ref={dndRef}
      data-tooltip-id={c.id}
      className={cn("toolbar group", className)}
      {...rest}
    >
      {children}
      <Tooltip
        id={c.id}
        globalCloseEvents={{ clickOutsideAnchor: true }}
        className={cn("!z-tooltip !p-0")}
        clickable
        openOnClick
        place="top"
        delayShow={400}
        delayHide={200}
        data-html2canvas-ignore
        render={() => {
          return (
            <div className="flex-center" data-html2canvas-ignore>
              <span {...listeners} {...attributes} className={BUTTON_CN}>
                <RiDragMove2Fill size={20} />
              </span>
              <Button
                frontIcon={<BsPlusCircleDotted />}
                text={`Add bullet points to ${place ?? "entry"}`}
                endIcon={<BlurImage src={image} className="ml-2" />}
                baseCn="flex-y"
                className={BUTTON_CN}
                onClick={addBullets}
              />
            </div>
          );
        }}
      />
    </li>
  );
};
