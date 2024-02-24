import { api, cn } from "~/utils";
import { DndProvider } from "../dnd/DndProvider";
import { useComponentContext } from "../../contexts/ComponentContext";
import { useDesignContext } from "../../contexts/DesignContext";
import { BigEntrySkeleton } from "../BigEntrySkeleton";
import { splitDescription } from "~/modules/utils";

const { log } = console;

export const Experience = () => {
  const { design } = useDesignContext();
  const c = useComponentContext();
  const { data: user, isLoading: isUserLoading } = api.users.get.useQuery();

  if (isUserLoading || !user) return <BigEntrySkeleton />;

  const providerProps = {
    className: cn(design.baseComponents?.experience?.className),
    /**
     * Always passed for the `DndProvider` component.
     */
    ...c.hydratableProps!(splitDescription(user)),
  };

  return <DndProvider {...providerProps} />;
};
