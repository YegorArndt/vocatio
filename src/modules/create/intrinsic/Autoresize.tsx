import cn from "classnames";
import { useCallback, type CSSProperties, FormEvent } from "react";
import { AnimatedDiv } from "~/components/AnimatedDiv";
import { useDraftContext } from "~/modules/draft/DraftContext";
import { useComponentContext } from "../ComponentContext";
import { debounce } from "lodash-es";

export type AutoresizeProps = {
  value?: string;
  className?: string;
  style?: CSSProperties;
};

export const Autoresize = (props: AutoresizeProps) => {
  let { value, style, className } = props;
  const c = useComponentContext();
  const { updateDesign } = useDraftContext();

  if (!value) return null;

  const debouncedUpdateDesign = useCallback(
    debounce((text) => {
      const newProps = { ...c.props, value: text };
      c.props = newProps;
      updateDesign();
    }, 500),
    []
  );

  return (
    <AnimatedDiv
      contentEditable
      data-placeholder={value}
      className={cn("break-words", className)}
      style={style}
      suppressContentEditableWarning
      onInput={(e: FormEvent<HTMLDivElement>) => {
        const { textContent } = e.currentTarget;
        debouncedUpdateDesign(textContent);
      }}
    >
      {value}
    </AnimatedDiv>
  );
};
