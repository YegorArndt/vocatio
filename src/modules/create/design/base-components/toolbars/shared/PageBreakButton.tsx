import { ImPageBreak } from "react-icons/im";
import { useState } from "react";
import { useComponentContext } from "../../../contexts/ComponentContext";
import { cn } from "~/utils";
import { BUTTON_CN } from "../constants";
import {
  TooltipTrigger,
  TooltipContent,
  Tooltip,
} from "~/components/ui/external/Tooltip";
import { useEvents } from "~/hooks/useEvents";
import { Events } from "~/modules/events/types";

export const PageBreakButton = () => {
  const [element, setElement] = useState<HTMLElement | null>(null);
  const { id } = useComponentContext();

  const reverse = () => {
    if (!element) return;
    // Reverse margin
    element.style.marginTop = "0px";

    // Reverse ball margin
    const splitWord = id.includes("place") ? "place" : "title";

    const numId = id.split(`${splitWord}-`)[1];

    const ball = document.getElementById(`ball-${numId}`);

    if (ball) {
      ball.style.marginTop = "0px";
    }
  };

  const initialize = () => {
    const initialElement = document.querySelector(
      `[data-tooltip-id="${id}"].adjusted-margin`
    ) as HTMLElement;
    setElement(initialElement || null);
  };

  useEvents({
    [Events.ON_LOAD]: initialize,
    [Events.DESIGN_CHANGED]: reverse,
  });

  return (
    <Tooltip>
      <TooltipTrigger
        className={cn(BUTTON_CN, "p-2", {
          "bg-green hover:!bg-green": !!element,
        })}
        onClick={(e) => {
          if (!document) return;

          const { currentTarget } = e;
          const correspondingElement = document.querySelector(
            `[data-tooltip-id="${id}"]`
          ) as HTMLElement;

          if (!correspondingElement) return;

          // Special class to indicate the element has adjusted margin
          const adjustedMarginClass = "adjusted-margin";

          // Determine the split word for ID
          const splitWord = id.includes("place") ? "place" : "title";
          const numId = id.split(`${splitWord}-`)[1];
          const ball = document.getElementById(`ball-${numId}`);

          // Apply smooth transition
          correspondingElement.style.transition = "margin 0.5s ease";
          if (ball) {
            ball.style.transition = "margin 0.5s ease";
          }

          // If the clicked element is the same as the one in the state
          if (element === correspondingElement) {
            // Reset the margin
            correspondingElement.style.marginTop = "";
            correspondingElement.classList.remove(adjustedMarginClass);

            if (ball) {
              ball.style.marginTop = "";
              ball.classList.remove(adjustedMarginClass);
            }

            // Set the element state to null
            setElement(null);
          } else {
            // Reset margin top for previously adjusted elements that come after the current element
            document
              .querySelectorAll("." + adjustedMarginClass)
              .forEach((el) => {
                if (
                  correspondingElement.compareDocumentPosition(el) &
                  Node.DOCUMENT_POSITION_FOLLOWING
                ) {
                  (el as HTMLElement).classList.remove(adjustedMarginClass);
                  (el as HTMLElement).style.marginTop = "";
                }
              });

            // Set the current element as the new element
            setElement(correspondingElement);

            // Get all page-break elements
            const pageBreaks = Array.from(
              document.querySelectorAll(".page-break")
            );

            // Get the button's bottom position
            const buttonRect = currentTarget.getBoundingClientRect();
            let nextPageBreak = pageBreaks.find((pageBreak) => {
              return pageBreak.getBoundingClientRect().top > buttonRect.bottom;
            });

            if (!nextPageBreak) return;

            // Calculate the distance to the next page break
            const distance =
              nextPageBreak.getBoundingClientRect().top - buttonRect.bottom;

            // Set the margin top
            correspondingElement.style.marginTop = `${distance + 50}px`;
            correspondingElement.classList.add(adjustedMarginClass);

            if (ball) {
              ball.style.marginTop = `${distance + 50}px`;
              ball.classList.add(adjustedMarginClass);
            }
          }
        }}
      >
        <ImPageBreak />
      </TooltipTrigger>
      <TooltipContent>
        {element ? "Push back up" : "Push to next page"}
      </TooltipContent>
    </Tooltip>
  );
};
