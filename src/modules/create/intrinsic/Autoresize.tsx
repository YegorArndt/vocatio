import cn from "classnames";
import { useCallback, type CSSProperties, FormEvent, useRef } from "react";
import { AnimatedDiv } from "~/components/AnimatedDiv";
import { useDraftContext } from "~/modules/draft/DraftContext";
import { useComponentContext } from "../ComponentContext";
import { debounce } from "lodash-es";

const { log } = console;

export type AutoresizeProps = {
  value?: string;
  className?: string;
  style?: CSSProperties;
  type?: "value" | "label" | "smallText";
};

export const Autoresize = (props: AutoresizeProps) => {
  let { value, style, className, type = "value" } = props;
  const initialValue = useRef(value);
  const divRef = useRef<HTMLDivElement>(null);
  const c = useComponentContext();
  const { updateDesign } = useDraftContext();

  if (!initialValue.current) return null;

  const debouncedUpdateDesign = useCallback(
    debounce((text) => {
      const newProps = { ...c.props, [type]: text };
      c.props = newProps;
      updateDesign(); // TODO: whitespace collapse
    }, 10000),
    []
  );

  return (
    <AnimatedDiv
      contentEditable
      data-placeholder={value}
      className={cn("whitespace-pre-wrap break-words", className)}
      style={style}
      suppressContentEditableWarning
      onInput={(e: FormEvent<HTMLDivElement>) => {
        const { textContent } = e.currentTarget;
        debouncedUpdateDesign(textContent);
      }}
      ref={divRef}
    >
      {value}
    </AnimatedDiv>
  );
};
