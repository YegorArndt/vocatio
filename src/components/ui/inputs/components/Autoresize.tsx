import cn from "classnames";
import {
  type SyntheticEvent,
  type TextareaHTMLAttributes,
  type KeyboardEvent,
  useRef,
  useEffect,
} from "react";

export type AutoresizeProps = {
  id: string;
  value: string | undefined;
  baseCn?: string;
  className?: string;
} & TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Autoresize = (props: AutoresizeProps) => {
  const { className, id, value } = props;
  const _value = useRef(localStorage.getItem(id) ?? value);
  const contentEditableRef = useRef<HTMLDivElement>(null);

  const setValue = (newValue: string) => {
    _value.current = newValue;
    localStorage.setItem(id, newValue);
  };

  const onInput = (e: SyntheticEvent) => {
    const newValue = e.currentTarget.textContent ?? "";
    setValue(newValue);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Shift") {
      e.preventDefault();
      if (contentEditableRef.current) {
        contentEditableRef.current.textContent =
          contentEditableRef.current.getAttribute("data-placeholder");
        const newValue = contentEditableRef.current.textContent;
        setValue(newValue!);
      }
    }
  };

  useEffect(() => {
    if (_value.current) localStorage.setItem(id, _value.current);
  }, []);

  return (
    <div
      contentEditable
      className={cn("reset max-w-[400px] break-words", className)}
      onInput={onInput}
      onKeyDown={onKeyDown}
      data-placeholder={value ?? _value.current}
      ref={contentEditableRef}
    >
      {_value.current}
    </div>
  );
};
