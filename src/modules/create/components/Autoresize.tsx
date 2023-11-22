import cn from "classnames";
import { type SyntheticEvent, useRef, useEffect, CSSProperties } from "react";
import { ComponentValue } from "~/modules/draft/types/components";

export type AutoresizeProps = {
  id: string;
  value: ComponentValue;
  className?: string;
  style?: CSSProperties;
};

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
    if (_value.current) localStorage.setItem(id, _value.current as string);
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
      {_value.current as string}
    </div>
  );
};
