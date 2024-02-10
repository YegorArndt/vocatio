import { usePersistentData } from "~/hooks/usePersistentData";
import { DndProvider } from "./DndProvider";
import { useComponentContext } from "../contexts/ComponentContext";
import { useDesignContext } from "../contexts/DesignContext";

const { log } = console;

export const Contact = () => {
  const { ls } = usePersistentData();
  const { design } = useDesignContext();
  const c = useComponentContext();

  if (!ls.user) return <div className="skeleton h-[50px] w-full" />;

  const providerProps = {
    className: design.baseComponents.contact.className,
    /**
     * Always passed for the `DndProvider` component.
     */
    // @ts-ignore
    ...c.hydratableProps!(ls.user!),
  };

  return <DndProvider {...providerProps} />;
};
