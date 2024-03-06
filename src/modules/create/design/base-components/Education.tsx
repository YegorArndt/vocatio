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

  const className = design.baseComponents.education.className;

  return (
    <DndProvider
      className={className}
      // @ts-ignore
      {...c.hydratableProps!(user)}
    />
  );
};
