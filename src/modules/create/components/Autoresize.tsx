import cn from "classnames";
import { type SyntheticEvent, useRef, useEffect, HTMLAttributes } from "react";

export type AutoresizeProps = {
  id: string;
  value: string | undefined;
} & HTMLAttributes<HTMLDivElement>;

export const Autoresize = (props: AutoresizeProps) => {
  const { id, value, style, className } = props;

  const _value = useRef(localStorage.getItem(id) || value);

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
      onInput={onInput}
      data-placeholder={value ?? _value.current}
      className={cn("max-w-[400px] break-words", className, {})}
      style={style}
      suppressContentEditableWarning
    >
      {_value.current}
    </div>
  );
};
