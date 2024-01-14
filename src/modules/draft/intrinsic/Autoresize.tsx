import cn from "classnames";
import { useCallback, type CSSProperties, FormEvent, useRef } from "react";
import { AnimatedDiv } from "~/components/AnimatedDiv";
import { useDraftContext } from "~/modules/draft/DraftContext";
import { useComponentContext } from "../components/ComponentContext";
import { debounce } from "lodash-es";

const { log } = console;

export type AutoresizeProps = {
  value?: string | null;
  className?: string;
  style?: CSSProperties;
  type?: "value" | "label" | "smallText";
};

export const Autoresize = (props: AutoresizeProps) => {
  const { value, style, className, type = "value" } = props;
  const initialValue = useRef(value);
  const divRef = useRef<HTMLDivElement>(null);
  const c = useComponentContext();
  const { updateDesign } = useDraftContext();

  const debouncedUpdateDesign = useCallback(
    debounce((text) => {
      //@ts-ignore
      const newProps = { ...c.props, [type]: text };
      //@ts-ignore
      c.props = newProps;
      updateDesign(); // TODO: whitespace collapse
    }, 10000),
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
    <AnimatedDiv
      contentEditable
      data-placeholder={value}
      className={cn("!block whitespace-pre-wrap break-words", className)}
      style={style}
      suppressContentEditableWarning
      onInput={(e: FormEvent<HTMLDivElement>) => {
        const { textContent } = e.currentTarget;
        debouncedUpdateDesign(textContent);
      }}
      ref={divRef}
      onPaste={handlePaste}
    >
      {value}
    </AnimatedDiv>
  );
};
