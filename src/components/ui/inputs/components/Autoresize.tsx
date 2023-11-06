import {
  type RefObject,
  useRef,
  useEffect,
  TextareaHTMLAttributes,
} from "react";
import cn from "classnames";

import { useForm } from "react-hook-form";
import { useDraftContext } from "~/modules/draft/DraftContext";

const lineHeightMultiplier = 1.5;
const averageCharMultiplier = 0.48;

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

export type AutoresizeProps = {
  baseCn?: string;
  className?: string;
  name: string;
  value: string;
} & TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Autoresize = (props: AutoresizeProps) => {
  const { baseCn, className, name, value, ...other } = props;

  const { downloadFired } = useDraftContext();

  const { register, watch } = useForm({
    defaultValues: {
      [name]: localStorage.getItem(name) ?? value,
    },
  });

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (downloadFired) return;

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
  }, [downloadFired]);

  useEffect(() => {
    const value = watch(name);

    if (typeof value !== "string") return;

    localStorage.setItem(name, value);
  }, [watch(name)]);

  return (
    <div ref={containerRef} className="break-words">
      {downloadFired ? (
        watch(name)
      ) : (
        <textarea
          {...other}
          {...register(name)}
          data-text={watch(name)}
          placeholder={value}
          className={cn(
            "hack reset resize-none overflow-hidden",
            baseCn,
            className
          )}
          suppressHydrationWarning
        />
      )}
    </div>
  );
};
