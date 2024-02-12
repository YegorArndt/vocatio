import { useComponentContext } from "../contexts/ComponentContext";
import { DndProvider } from "./dnd/DndProvider";

const { log } = console;

export const Entry = () => {
  const c = useComponentContext();

  //@ts-ignore
  return <DndProvider {...c.hydratableProps()} />;
};
