import { usePersistentData } from "~/hooks/usePersistentData";
import { useComponentContext } from "../contexts/ComponentContext";
import { DndProvider } from "./dnd/DndProvider";

const { log } = console;

export const Entry = () => {
  const { ls } = usePersistentData();
  const c = useComponentContext();

  if (!ls.user) return <div className="skeleton h-[50px] w-full" />;

  //@ts-ignore
  return <DndProvider {...c.hydratableProps()} />;
};
