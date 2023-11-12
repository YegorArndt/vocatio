import cn from "classnames";
import {
  type SyntheticEvent,
  type TextareaHTMLAttributes,
  useRef,
  useEffect,
} from "react";

export type AutoresizeProps = {
  baseCn?: string;
  className?: string;
  name: string;
  value: string | undefined;
} & TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Autoresize = (props: AutoresizeProps) => {
  const { baseCn, className, name, value, ...other } = props;
  const _value = useRef(localStorage.getItem(name) ?? value);

  const onInput = (e: SyntheticEvent) => {
    const newValue = e.currentTarget.textContent ?? "";
    _value.current = newValue;
    localStorage.setItem(name, newValue);
  };

  useEffect(() => {
    if (_value.current) localStorage.setItem(name, _value.current);
  }, []);

  return (
    <div
      contentEditable
      className={cn("reset max-w-[430px] break-words", className)}
      onInput={onInput}
      data-placeholder={value ?? _value.current}
    >
      {_value.current}
    </div>
  );
};
