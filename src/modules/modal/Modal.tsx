import cn from "classnames";
import { type PropsWithChildren } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Portal } from "~/components/Portal";

type ModalProps = PropsWithChildren<{
  isOpen: boolean;
  onClose?: () => void;
  className?: string;
}>;

export const Modal = (props: ModalProps) => {
  const { isOpen, onClose, children, className } = props;

  return (
    <AnimatePresence>
      {isOpen && (
        <Portal>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex-center modal fixed inset-0 z-modal bg-black bg-opacity-50 p-4"
            onClick={onClose}
          >
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.3 }}
              className={cn(
                "z-modal flex h-3/4 w-5/12 flex-col rounded-md bg-primary [&>*]:px-5 [&>*]:py-3",
                className
              )}
              onClick={(e) => e.stopPropagation()}
            >
              {children}
            </motion.div>
          </motion.div>
        </Portal>
      )}
    </AnimatePresence>
  );
};
