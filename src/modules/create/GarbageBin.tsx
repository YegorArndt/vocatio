import { useEffect, useState } from "react";
import { NormalizedComponent } from "../draft/types/components";
import Image from "next/image";
import { ComponentFactory } from "./ComponentFactory";
import { ComponentContext } from "./ComponentContext";
import { Button } from "~/components/ui/buttons/Button";
import { motion, AnimatePresence } from "framer-motion";

type GarbageBinProps = {
  vacancyId: string;
};

const getDeletedComponents = (lsKey: string) => {
  const deletedComponents = localStorage.getItem(lsKey);
  return deletedComponents ? JSON.parse(deletedComponents) : [];
};

export const GarbageBin = (props: GarbageBinProps) => {
  const { vacancyId } = props;
  const lsKey = `deleted-components-${vacancyId}`;
  const [deletedComponents, setDeletedComponents] = useState<
    NormalizedComponent[]
  >(getDeletedComponents(lsKey));
  const [shown, setShown] = useState(false);

  const src = deletedComponents.length ? "/full-trash.png" : "/empty-trash.png";

  useEffect(() => {
    const handler = () => {
      setDeletedComponents(getDeletedComponents(lsKey));
    };

    window.addEventListener("storageUpdate", handler);

    return () => {
      window.removeEventListener("storageUpdate", handler);
    };
  }, [lsKey]);

  // Animation variants
  const gridVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { scale: 1, opacity: 1 },
  };

  return (
    <div
      className="fixed bottom-[2rem] right-[2rem] flex flex-col"
      style={{ zIndex: 5000 }}
    >
      <AnimatePresence>
        {shown && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={gridVariants}
            transition={{ duration: 0.5 }}
            className="pointer-events-none grid grid-cols-2"
          >
            {deletedComponents.map((c, index) => (
              <div key={index} className="scale-90 transform border p-5">
                <ComponentContext.Provider value={c}>
                  <ComponentFactory />
                </ComponentContext.Provider>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <Button className="ml-auto" onClick={() => setShown(!shown)}>
        <Image
          draggable={false}
          src={src}
          alt="Empty Trash"
          width={60}
          height={60}
        />
      </Button>
    </div>
  );
};
