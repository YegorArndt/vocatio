import { RiDeleteBin2Fill } from "react-icons/ri";
import { BUTTON_CN } from "../constants";
import { useCrudContext } from "../../dnd/crud";
import { useComponentContext } from "../../../contexts/ComponentContext";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/external/Tooltip";
import { toast } from "sonner";

const { log } = console;

export const DeleteComponentButton = () => {
  const [isClicked, setIsClicked] = useState(false);

  const { removeComponent } = useCrudContext();
  const c = useComponentContext();

  return (
    <Tooltip>
      {isClicked ? (
        <>
          <TooltipTrigger
            className="h-full bg-red p-2"
            onClick={() => {
              removeComponent({ id: c.id, sectionId: c.sectionId });
              toast.success("Item deleted");
            }}
          >
            Click again to confirm delete
          </TooltipTrigger>
          <TooltipContent>Click outside CV to cancel</TooltipContent>
        </>
      ) : (
        <>
          <TooltipTrigger
            className={BUTTON_CN}
            onClick={(e) => {
              setIsClicked(!isClicked);
              e.stopPropagation();
            }}
          >
            <RiDeleteBin2Fill />
          </TooltipTrigger>
          <TooltipContent>Delete item</TooltipContent>
        </>
      )}
    </Tooltip>
  );
};
