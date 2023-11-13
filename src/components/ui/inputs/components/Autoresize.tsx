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
  baseCn?: string;
  className?: string;
} & TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Autoresize = (props: AutoresizeProps) => {
  const { baseCn, className, id, value, ...other } = props;
  const _value = useRef(localStorage.getItem(id) ?? value);

  const onInput = (e: SyntheticEvent) => {
    const newValue = e.currentTarget.textContent ?? "";
    _value.current = newValue;
    localStorage.setItem(id, newValue);
  };

  useEffect(() => {
    if (_value.current) localStorage.setItem(id, _value.current);
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
