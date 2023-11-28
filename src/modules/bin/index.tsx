import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { TbRestore } from "react-icons/tb";
import { RiDeleteBin6Line } from "react-icons/ri";

import { useDraftContext } from "../draft/DraftContext";
import { NormalizedComponent } from "../draft/types/components";
import { Button } from "~/components/ui/buttons/Button";
import { ComponentContext } from "../create/ComponentContext";
import { ComponentFactory } from "../create/ComponentFactory";
import { BlurImage } from "~/components/BlurImage";
import { Portal } from "~/components/Portal";
import { Checkbox } from "~/components/ui/inputs/Checkbox";
import { useForm } from "react-hook-form";
import { Placeholder } from "~/components/Placeholder";

const getDeletedComponents = (lsKey: string) => {
  const deletedComponents = localStorage.getItem(lsKey);
  return (
    deletedComponents ? JSON.parse(deletedComponents) : []
  ) as NormalizedComponent[];
};

export const Bin = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { vacancy, addNewComponent } = useDraftContext();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const { control, setValue, watch } = useForm();

  const onSelect = (cId: string) => {
    setSelectedIds((prev) => {
      const newSelected = prev.includes(cId)
        ? prev.filter((id) => id !== cId)
        : [...prev, cId];
      return newSelected;
    });
  };

  const lsKey = `deleted-components-${vacancy.id}`;

  const [deletedComponents, setDeletedComponents] = useState<
    NormalizedComponent[]
  >(getDeletedComponents(lsKey));

  const removeFromBin = (c: NormalizedComponent) => {
    setDeletedComponents((prev) => {
      const newDeleted = prev.filter((c2) => c2.id !== c.id);
      localStorage.setItem(lsKey, JSON.stringify(newDeleted));
      return newDeleted;
    });
  };

  useEffect(() => {
    const handler = () => setDeletedComponents(getDeletedComponents(lsKey));
    window.addEventListener("storageUpdate", handler);
    return () => window.removeEventListener("storageUpdate", handler);
  }, [lsKey]);

  return (
    <>
      <Button
        frontIcon={
          <BlurImage src="/bin-full.png" alt="bin" height={15} width={15} />
        }
        text="View deleted items"
        className="common hover flex-y gap-1"
        onClick={() => setIsOpen(!isOpen)}
      />
      <AnimatePresence>
        {isOpen && (
          <Portal>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex-center modal fixed inset-0 z-modal bg-black bg-opacity-50 p-4"
              onClick={(e) => setIsOpen(false)}
            >
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                transition={{ duration: 0.3 }}
                className="z-modal flex h-3/4 w-5/12 flex-col bg-primary [&>*]:px-5 [&>*]:py-3"
                onClick={(e) => e.stopPropagation()}
              >
                <header className="flex-between bg-secondary">
                  You have deleted so far
                  <Button text="Close" onClick={() => setIsOpen(false)} />
                </header>
                {deletedComponents.length === 0 && (
                  <Placeholder
                    text="Keep editing your CV and once you need to restore something come back here."
                    onClick={() => setIsOpen(false)}
                    actionContent="Go back"
                  />
                )}
                <div className="flex flex-col gap-4 overflow-y-auto overflow-x-hidden">
                  {deletedComponents.map((c) => (
                    <ComponentContext.Provider key={c.id} value={c}>
                      <div
                        className="flex-between gap-[3rem]"
                        onClick={() => {
                          setValue(c.id, !watch(c.id));
                          onSelect(c.id);
                        }}
                      >
                        <div className="flex-center gap-4">
                          <Checkbox
                            name={c.id}
                            control={control}
                            onClick={() => onSelect(c.id)}
                          />
                          <Button
                            onClick={() => {
                              removeFromBin(c);
                              addNewComponent(c, c);
                            }}
                            className="common flex-center hover:underline"
                          >
                            <TbRestore />
                          </Button>
                          <Button
                            onClick={() => removeFromBin(c)}
                            className="common flex-center hover:underline"
                          >
                            <RiDeleteBin6Line />
                          </Button>
                        </div>
                        <div className="max-w-1/2 grow cursor-pointer select-none overflow-hidden rounded border p-2 transition hover:border-white [&>*]:pointer-events-none">
                          <h3 className="text-lg font-bold">{c.type}</h3>
                          <ComponentFactory />
                        </div>
                      </div>
                    </ComponentContext.Provider>
                  ))}
                </div>
                {deletedComponents.length > 0 && (
                  <footer className="border-top mt-auto flex">
                    <Button
                      text="Restore selected"
                      frontIcon={<TbRestore />}
                      onClick={() => {
                        selectedIds.forEach((id) => {
                          const c = deletedComponents.find((c) => c.id === id);
                          if (c) {
                            removeFromBin(c);
                            addNewComponent(c, c);
                          }
                        });
                        setSelectedIds([]);
                      }}
                      className="common sm primary"
                      disabled={!selectedIds.length}
                    />
                  </footer>
                )}
              </motion.div>
            </motion.div>
          </Portal>
        )}
      </AnimatePresence>
    </>
  );
};
