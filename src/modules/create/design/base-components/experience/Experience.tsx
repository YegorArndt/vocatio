import { api, cn } from "~/utils";
import { DndProvider } from "../dnd/DndProvider";
import { useComponentContext } from "../../contexts/ComponentContext";
import { useDesignContext } from "../../contexts/DesignContext";
import { BigEntrySkeleton } from "../BigEntrySkeleton";
import { RouterUser } from "~/modules/types";

const { log } = console;

/**
 * @description Splits the user's experience description into an array of strings (bullet points).
 */
const splitDescription = (user: RouterUser) =>
  user.experience.map((entry) => ({
    ...entry,
    description: entry.description.split("•"),
  }));

export const Experience = () => {
  const { design } = useDesignContext();
  const c = useComponentContext();
  const { data: user, isLoading: isUserLoading } = api.users.get.useQuery();

  if (isUserLoading || !user) return <BigEntrySkeleton />;

  const providerProps = {
    className: cn(design.baseComponents?.experience?.className, "cv-section"),
    /**
     * Always passed for the `DndProvider` component.
     */
    ...c.hydratableProps!(splitDescription(user)),
  };

  return <DndProvider {...providerProps} />;
};
