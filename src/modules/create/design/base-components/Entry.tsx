import { useComponentContext } from "../contexts/ComponentContext";
import { DndProvider } from "./dnd/DndProvider";
import { useDesignContext } from "../contexts/DesignContext";
import { api } from "~/utils";

const { log } = console;

export const Entry = () => {
  const c = useComponentContext();
  const { design } = useDesignContext();
  const { data: user } = api.users.get.useQuery();

  if (!user)
    return (
      <div className="flex-y my-5 flex-wrap gap-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="light-skeleton h-4 w-[80px] rounded-md" />
        ))}
      </div>
    );

  const dndProviderProps = {
    className: design.baseComponents?.entry?.className,
    // @ts-ignore
    ...c.hydratableProps(),
  };

  // @ts-ignore
  return <DndProvider {...dndProviderProps} />;
};
