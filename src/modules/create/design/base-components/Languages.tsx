import { DndProvider } from "./dnd/DndProvider";
import { useComponentContext } from "../contexts/ComponentContext";
import { useDesignContext } from "../contexts/DesignContext";
import { api } from "~/utils";

const { log } = console;

export const Languages = () => {
  const { data: user } = api.users.get.useQuery();
  const { design } = useDesignContext();
  const c = useComponentContext();

  if (!user)
    return (
      <div className="flex-y my-5 flex-wrap gap-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="light-skeleton h-4 w-[80px] rounded-md" />
        ))}
      </div>
    );

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
