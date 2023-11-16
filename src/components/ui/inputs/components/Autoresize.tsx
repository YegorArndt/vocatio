import cn from "classnames";
import {
  type SyntheticEvent,
  type TextareaHTMLAttributes,
  useRef,
  useEffect,
} from "react";

export type AutoresizeProps = {
  id: string;
  value: string | undefined;
  className?: string;
} & TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Autoresize = (props: AutoresizeProps) => {
  const { className, id, value } = props;

  const _value = useRef(localStorage.getItem(id) || value);
  const contentEditableRef = useRef<HTMLDivElement>(null);

  const setValue = (newValue: string) => {
    _value.current = newValue;
    localStorage.setItem(id, newValue);
  };

  const onInput = (e: SyntheticEvent) => {
    const newValue = e.currentTarget.textContent ?? "";
    setValue(newValue);
  };

  useEffect(() => {
    if (_value.current) localStorage.setItem(id, _value.current);
  }, []);

  return (
    <div
      contentEditable
      className={cn("max-w-[400px] break-words outline-none", className)}
      onInput={onInput}
      data-placeholder={value ?? _value.current}
      ref={contentEditableRef}
    >
      {value ?? _value.current}
    </div>
  );
};
