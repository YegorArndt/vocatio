import cn from "classnames";
import {
  useCallback,
  type CSSProperties,
  useRef,
  FormEvent,
  useState,
} from "react";
import { AnimatedDiv } from "~/components/AnimatedDiv";
import { useComponentContext } from "../contexts/ComponentContext";
import { debounce } from "lodash-es";
import { BsArrowsCollapse } from "react-icons/bs";
import { FaBold, FaItalic, FaUnderline } from "react-icons/fa";
import { RxLetterCaseUppercase } from "react-icons/rx";
import {
  TooltipTrigger,
  TooltipContent,
  Tooltip,
  TooltipProvider,
} from "~/components/ui/external/Tooltip";
import { toast } from "sonner";
import { isUrl } from "../utils";

const { log } = console;

export type AutoresizeProps = {
  value?: string | null;
  className?: string;
  style?: CSSProperties;
  type?: "value" | "label" | "smallText";
};

export const actions = [
  {
    icon: <FaBold />,
    className: "font-bold",
    tooltip: "Bolden selected text",
  },
  {
    icon: <FaItalic />,
    className: "italic",
    tooltip: "Italicize selected text",
  },
  {
    icon: <FaUnderline />,
    className: "underline",
    tooltip: "Underline selected text",
  },
  {
    icon: <BsArrowsCollapse style={{ transform: "rotate(90deg)" }} />,
    className: "text-center",
    tooltip: "Center align text",
  },
  {
    icon: <RxLetterCaseUppercase />,
    className: "uppercase",
    tooltip: "Transform text to uppercase",
  },
];

const saveSelection = () => {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return null;

  const range = selection.getRangeAt(0);
  const startContainer = range.startContainer;
  const endContainer = range.endContainer;
  const startOffset = range.startOffset;
  const endOffset = range.endOffset;

  return { startContainer, startOffset, endContainer, endOffset };
};

type SavedRange = {
  startContainer: Node;
  startOffset: number;
  endContainer: Node;
  endOffset: number;
};

const restoreSelection = (savedRange: SavedRange) => {
  if (!savedRange) return;

  const selection = window.getSelection();
  if (!selection) return;

  const range = document.createRange();

  try {
    // Check if the start and end nodes are still valid
    if (
      savedRange.startContainer.parentNode &&
      savedRange.endContainer.parentNode
    ) {
      range.setStart(
        savedRange.startContainer,
        // @ts-ignore
        Math.min(savedRange.startOffset, savedRange.startContainer.length)
      );
      range.setEnd(
        savedRange.endContainer,
        // @ts-ignore
        Math.min(savedRange.endOffset, savedRange.endContainer.length)
      );

      selection.removeAllRanges();
      selection.addRange(range);
    }
  } catch (err) {
    console.error("Error restoring selection: ", err);
    // Handle the error as needed
  }
};

export const Autoresize = (props: AutoresizeProps) => {
  const { value, style, className, type = "value" } = props;
  const initialValue = useRef(value);
  const divRef = useRef<HTMLDivElement>(null);
  const c = useComponentContext();
  // const { updateDesign } = useDraftContext();

  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);

  const [isMouseOverToolbar, setIsMouseOverToolbar] = useState(false);

  const handleBlur = () => {
    if (!isMouseOverToolbar) {
      setShowTooltip(false);
    }
  };

  const handleMouseEnterToolbar = () => {
    setIsMouseOverToolbar(true);
  };

  const handleMouseLeaveToolbar = () => {
    setIsMouseOverToolbar(false);
    if (!divRef.current?.contains(document.activeElement)) {
      setShowTooltip(false);
    }
  };

  const handleSelect = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setTooltipPosition({
        x: rect.left + window.scrollX,
        y: rect.bottom + window.scrollY, // Use bottom for vertical positioning
      });
      setShowTooltip(selection.toString().length > 0);
    } else {
      setShowTooltip(false);
    }
  };

  const wrapSelectedText = (className: string) => {
    try {
      const savedRange = saveSelection();
      const selection = window.getSelection();
      if (!selection?.rangeCount) return; // No selection made

      const range = selection.getRangeAt(0);
      if (range.collapsed) return; // No text is selected

      let container = range.commonAncestorContainer.parentElement;

      if (container?.tagName === "SPAN") {
        container.classList.toggle(className);

        if (container.classList.length === 0) {
          const parent = container.parentNode;

          if (!parent) return;

          while (container.firstChild) {
            parent.insertBefore(container.firstChild, container);
          }
          parent.removeChild(container);
        }
      } else {
        const span = document.createElement("span");
        span.className = className;
        range.surroundContents(span);
      }

      restoreSelection(savedRange!);
    } catch (err) {
      toast.error(
        "Delete existing text modifications within the selection to proceed."
      );
    }
  };

  const debouncedUpdateDesign = useCallback(
    debounce((text) => {
      //@ts-ignore
      const newProps = { ...c.props, [type]: text };
      //@ts-ignore
      c.props = newProps;
      // updateDesign(); // TODO: whitespace collapse
    }, 5000),
    []
  );

  const handlePaste = (e: ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData?.getData("text/plain") || "";
    document.execCommand("insertText", false, text);
    debouncedUpdateDesign(text);
  };

  if (!initialValue.current) return null;

  return (
    <>
      <AnimatedDiv
        contentEditable
        data-placeholder={value}
        className={cn("!block whitespace-pre-wrap", className, {
          "break-words": !isUrl(value),
          "break-all": isUrl(value),
        })}
        style={style}
        suppressContentEditableWarning
        onInput={(e: FormEvent<HTMLDivElement>) => {
          const { innerHTML } = e.currentTarget;
          debouncedUpdateDesign(innerHTML.toString());
        }}
        ref={divRef}
        onPaste={handlePaste}
        dangerouslySetInnerHTML={{ __html: value }}
        onSelect={handleSelect}
        onBlur={handleBlur}
      />
      {showTooltip && (
        <div
          style={{
            position: "absolute",
            left: `${tooltipPosition.x - 350}px`,
            top: `${tooltipPosition.y - 70}px`,
            transform: "translateY(100%)",
            zIndex: 1000,
          }}
          className="autoresize-panel flex-y"
          onMouseEnter={handleMouseEnterToolbar}
          onMouseLeave={handleMouseLeaveToolbar}
        >
          <TooltipProvider>
            {actions.map((x) => (
              <Tooltip key={x.tooltip}>
                <TooltipTrigger
                  className="sm hover"
                  onClick={() => wrapSelectedText(x.className)}
                >
                  {x.icon}
                </TooltipTrigger>
                <TooltipContent
                  className="font-normal"
                  side="bottom"
                  data-tooltip-delay-show={0}
                >
                  {x.tooltip}
                </TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
        </div>
      )}
    </>
  );
};
