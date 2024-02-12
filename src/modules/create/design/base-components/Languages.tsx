import { DndProvider } from "./dnd/DndProvider";
import { useComponentContext } from "../contexts/ComponentContext";
import { useDesignContext } from "../contexts/DesignContext";
import { api } from "~/utils";

const { log } = console;

export const Languages = () => {
  const { data: user } = api.users.get.useQuery();
  const { design } = useDesignContext();
  const c = useComponentContext();

  if (!user) return <div className="skeleton h-[50px] w-full" />;

  const providerProps = {
    className: design.baseComponents?.languages?.className,
    /**
     * Always passed for the `DndProvider` component.
     */
    //@ts-ignore
    ...c.hydratableProps!(user),
  };

  return <DndProvider {...providerProps} />;
};
