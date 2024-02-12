import { DndProvider } from "./dnd/DndProvider";
import { useComponentContext } from "../contexts/ComponentContext";
import { useDesignContext } from "../contexts/DesignContext";
import { BigEntrySkeleton } from "./BigEntrySkeleton";
import { api } from "~/utils";

const { log } = console;

export const Education = () => {
  const { data: user } = api.users.get.useQuery();
  const { design } = useDesignContext();
  const c = useComponentContext();

  if (!user) return <BigEntrySkeleton />;

  const providerProps = {
    className: design.baseComponents.education.className,
    /**
     * Always passed for the `DndProvider` component.
     */
    // @ts-ignore
    ...c.hydratableProps!(user),
  };

  return <DndProvider {...providerProps} />;
};
