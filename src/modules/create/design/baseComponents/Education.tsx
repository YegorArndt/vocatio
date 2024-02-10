import { usePersistentData } from "~/hooks/usePersistentData";
import { DndProvider } from "./DndProvider";
import { useComponentContext } from "../contexts/ComponentContext";
import { useDesignContext } from "../contexts/DesignContext";
import { BigEntrySkeleton } from "./BigEntrySkeleton";

const { log } = console;

export const Education = () => {
  const { ls } = usePersistentData();
  const { design } = useDesignContext();
  const c = useComponentContext();

  if (!ls.user) return <BigEntrySkeleton />;

  const providerProps = {
    className: design.baseComponents.education.className,
    /**
     * Always passed for the `DndProvider` component.
     */
    // @ts-ignore
    ...c.hydratableProps!(ls.user!),
  };

  return <DndProvider {...providerProps} />;
};
