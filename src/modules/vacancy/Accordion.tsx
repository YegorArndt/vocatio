import { useState, ReactNode, PropsWithChildren } from "react";
import { AnimatePresence, motion } from "framer-motion";

type AccordionProps = PropsWithChildren<{
  trigger: (
    expanded: boolean,
    setExpanded: (expanded: boolean) => void
  ) => ReactNode;
  initiallyOpen?: boolean;
}>;

export const Accordion = (props: AccordionProps) => {
  const { trigger, children, initiallyOpen = false } = props;
  const [expanded, setExpanded] = useState(initiallyOpen);

  return (
    <>
      {trigger(expanded, setExpanded)}
      <AnimatePresence initial={initiallyOpen}>
        {expanded && (
          <motion.div
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: "auto" },
              collapsed: { opacity: 0, height: 0 },
            }}
            transition={{
              opacity: { duration: 0.2, ease: [0.04, 0.62, 0.23, 0.98] }, // Shortened duration for opacity
              height: { duration: 0.8, ease: [0.04, 0.62, 0.23, 0.98] },
            }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
