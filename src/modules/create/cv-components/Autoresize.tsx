import { motion } from "framer-motion";
import cn from "classnames";
import {
  type SyntheticEvent,
  useRef,
  useEffect,
  type CSSProperties,
} from "react";

import type { ComponentValue } from "~/modules/draft/types/components";

export type AutoresizeProps = {
  id?: string;
  value?: ComponentValue;
  className?: string;
  style?: CSSProperties;
  tooltipId?: string;
};

export const Autoresize = (props: AutoresizeProps) => {
  const { id, value, style, className, tooltipId } = props;

  const _value = useRef(localStorage.getItem(id!) || value);

  const setValue = (newValue: string) => {
    _value.current = newValue;
    localStorage.setItem(id!, newValue);
  };

  const onInput = (e: SyntheticEvent) => {
    const newValue = e.currentTarget.textContent ?? "";
    setValue(newValue);
  };

  useEffect(() => {
    if (_value.current) localStorage.setItem(id!, _value.current as string);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      contentEditable
      onInput={onInput}
      data-placeholder={value ?? _value.current}
      className={cn("break-words", className)}
      style={style}
      suppressContentEditableWarning
      data-tooltip-id={tooltipId}
    >
      {_value.current as string}
    </motion.div>
  );
};
