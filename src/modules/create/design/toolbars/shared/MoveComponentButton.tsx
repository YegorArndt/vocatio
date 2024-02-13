import { DraggableAttributes } from "@dnd-kit/core";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { RiDragMove2Fill } from "react-icons/ri";
import { cn } from "~/utils";
import { BUTTON_CN } from "../constants";
import {
  TooltipTrigger,
  Tooltip,
  TooltipContent,
} from "~/components/ui/external/Tooltip";

type MoveComponentButton = {
  listeners: SyntheticListenerMap | undefined;
  attributes: DraggableAttributes;
};

export const MoveComponentButton = (props: MoveComponentButton) => {
  const { listeners, attributes } = props;

  return (
    <Tooltip>
      <TooltipTrigger
        {...listeners}
        {...attributes}
        className={cn(BUTTON_CN, "p-2")}
      >
        <RiDragMove2Fill size={20} />
      </TooltipTrigger>
      <TooltipContent>Move item</TooltipContent>
    </Tooltip>
  );
};
