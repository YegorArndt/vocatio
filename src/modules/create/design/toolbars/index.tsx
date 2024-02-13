import { type DraggableAttributes } from "@dnd-kit/core";
import { type SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import {
  type HTMLAttributes,
  type PropsWithChildren,
  MutableRefObject,
} from "react";
import cn from "classnames";

import { useComponentContext } from "../contexts/ComponentContext";
import { BUTTON_CN } from "./constants";
import { Tooltip } from "react-tooltip";
import { AddComponentPopover } from "./shared/AddComponentButton";
import { DeleteComponentButton } from "./shared/DeleteComponentButton";
import { PageBreakButton } from "./shared/PageBreakButton";
import { BiDuplicate } from "react-icons/bi";
import { useCrudContext } from "../base-components/dnd/crud";
import {
  TooltipProvider,
  TooltipTrigger,
  Tooltip as RadixTooltip,
  TooltipContent,
} from "~/components/ui/external/Tooltip";
import { MoveComponentButton } from "./shared/MoveComponentButton";
import { startCase } from "lodash-es";
import { useDesignContext } from "../contexts/DesignContext";

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

  const { addComponent } = useCrudContext();
  const c = useComponentContext();
  const { design } = useDesignContext();

  return (
    <li ref={dndRef} data-tooltip-id={c.id} className={className} {...rest}>
      {children}
      <Tooltip
        id={c.id}
        globalCloseEvents={{ clickOutsideAnchor: true }}
        className="z-tooltip !p-0"
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
                {/* Duplicate button  */}
                <RadixTooltip>
                  <TooltipTrigger
                    className={cn(BUTTON_CN, "p-2")}
                    onClick={() =>
                      addComponent({
                        ...c,
                        props: {
                          ...(c.hydratedProps ?? {}),
                          className: cn(
                            design.baseComponents[c.type]?.className,
                            {
                              "list-disc": c.id?.includes("bullet"),
                            }
                          ),
                        },
                      })
                    }
                  >
                    <BiDuplicate />
                  </TooltipTrigger>
                  <TooltipContent>Duplicate {startCase(c.type)}</TooltipContent>
                </RadixTooltip>
                <AddComponentPopover />
                <DeleteComponentButton />
              </TooltipProvider>
            </div>
          );
        }}
      />
    </li>
  );
};
