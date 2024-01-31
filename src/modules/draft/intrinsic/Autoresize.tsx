import cn from "classnames";
import { useCallback, type CSSProperties, useRef, FormEvent } from "react";
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

const isUrl = (url: string | null | undefined) => {
  if (!url) return false;

  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
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
    }, 1000000),
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
      className={cn("!block whitespace-pre-wrap", className, {
        "break-words": !isUrl(value),
        "break-all": isUrl(value),
      })}
      style={style}
      suppressContentEditableWarning
      onInput={(e: FormEvent<HTMLDivElement>) => {
        const { innerHTML } = e.currentTarget;
        debouncedUpdateDesign(innerHTML);
      }}
      ref={divRef}
      onPaste={handlePaste}
      dangerouslySetInnerHTML={{ __html: value }}
    />
  );
};
