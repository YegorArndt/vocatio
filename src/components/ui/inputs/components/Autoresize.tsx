import cn from "classnames";
import {
  type SyntheticEvent,
  type TextareaHTMLAttributes,
  useRef,
} from "react";

export type AutoresizeProps = {
  baseCn?: string;
  className?: string;
  name: string;
  value: string;
} & TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Autoresize = (props: AutoresizeProps) => {
  const { baseCn, className, name, value, ...other } = props;
  const _value = useRef(localStorage.getItem(name) ?? value);

  const onInput = (e: SyntheticEvent) => {
    const newValue = e.currentTarget.textContent ?? "";
    _value.current = newValue;
    localStorage.setItem(name, newValue);
  };

  return (
    <div
      contentEditable
      className={cn("reset", className)}
      onInput={onInput}
      data-placeholder={value}
    >
      {_value.current}
    </div>
  );
};
