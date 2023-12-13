import { motion, type MotionProps } from "framer-motion";
import { type PropsWithChildren } from "react";

export const AnimatedDiv = (
  props: PropsWithChildren<Record<string, unknown>> & MotionProps
) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      {...props}
    />
  );
};
