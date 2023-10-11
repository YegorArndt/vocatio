import { type RefObject, useEffect, useRef } from "react";
import cn from "classnames";

import { reset } from "../../constants";

const lineHeightMultiplier = 1.5;
const averageCharMultiplier = 0.58;

const hasContentWrapped = (textarea: HTMLTextAreaElement, fontSize: number) => {
  const averageCharWidth = fontSize * averageCharMultiplier;
  const contentWidth = averageCharWidth * textarea.value.length;
  return contentWidth > textarea.clientWidth;
};

const resize = (containerRef: RefObject<HTMLDivElement>) => {
  if (!containerRef?.current) return;

  const { current: container } = containerRef;
  const textarea = container.children[0] as HTMLTextAreaElement;

  const fontSize = parseInt(window.getComputedStyle(textarea).fontSize, 10);

  const lineHeight = fontSize * lineHeightMultiplier;

  textarea.style.height = "auto";

  if (hasContentWrapped(textarea, fontSize)) {
    const lines = Math.ceil(textarea.scrollHeight / lineHeight);
    textarea.style.height = `${lines * lineHeight}px`;
  } else {
    textarea.style.height = `${lineHeight}px`;
  }
};

export type AutoresizeProps = any;

export const Autoresize = (props: AutoresizeProps) => {
  const { baseCn, className, ...other } = props;

  const containerRef = useRef<HTMLDivElement>(null);

  /**
   * Both effects handle auto-resizing the textarea.
   */
  useEffect(() => {
    resize(containerRef);

    const { current: container } = containerRef;

    if (!container) return;

    const textarea = container.children[0] as HTMLTextAreaElement;
    const callback = () => resize(containerRef);
    const events = ["input", "cut", "paste", "change"];

    if (textarea) {
      events.forEach((event) => {
        textarea.addEventListener(event, callback);
      });

      /**
       * Cleanup.
       */
      return () => {
        events.forEach((event) => {
          textarea.removeEventListener(event, callback);
        });
      };
    }
  }, []);

  return (
    <div ref={containerRef} className={cn("flex w-full")}>
      <textarea
        {...other}
        className={cn(
          "size-full resize-none overflow-hidden",
          reset,
          baseCn,
          className
        )}
        suppressHydrationWarning
      />
    </div>
  );
};
