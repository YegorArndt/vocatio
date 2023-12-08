import { motion } from "framer-motion";
import cn from "classnames";
import { type CSSProperties } from "react";

export type AutoresizeProps = {
  value?: string;
  className?: string;
  style?: CSSProperties;
};

export const Autoresize = (props: AutoresizeProps) => {
  const { value, style, className } = props;

  if (!value) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      contentEditable
      data-placeholder={value}
      className={cn("break-words", className)}
      style={style}
      suppressContentEditableWarning
    >
      {value}
    </motion.div>
  );
};
