import { motion, type MotionProps } from "framer-motion";
import { forwardRef, type Ref, type PropsWithChildren } from "react";

export const AnimatedDiv = forwardRef(
  (
    props: PropsWithChildren<Record<string, unknown>> & MotionProps,
    ref: Ref<HTMLDivElement>
  ) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        ref={ref}
        {...props}
      />
    );
  }
);
