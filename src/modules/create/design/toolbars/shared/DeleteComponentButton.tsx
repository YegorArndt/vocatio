import { RiDeleteBin2Fill } from "react-icons/ri";
import { Button } from "~/components/ui/buttons/Button";
import { BUTTON_CN } from "../constants";
import { useCrudContext } from "../../base-components/dnd/crud";
import { useComponentContext } from "../../contexts/ComponentContext";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/external/Tooltip";

export const DeleteComponentButton = () => {
  const [isClicked, setIsClicked] = useState(false);

  const { removeComponent } = useCrudContext();
  const c = useComponentContext();

  return isClicked ? (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger
          className="h-full bg-red p-2"
          onClick={() => removeComponent({ id: c.id, sectionId: c.sectionId })}
        >
          Click again to confirm delete
        </TooltipTrigger>
        <TooltipContent>Click outside CV to cancel</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ) : (
    <Button
      className={BUTTON_CN}
      onClick={(e) => {
        setIsClicked(!isClicked);
        e.stopPropagation();
      }}
    >
      <RiDeleteBin2Fill />
    </Button>
  );
};
