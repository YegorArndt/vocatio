import { usePersistentData } from "~/hooks/usePersistentData";
import { useComponentContext } from "../contexts/ComponentContext";
import { useDesignContext } from "../contexts/DesignContext";
import { cn } from "~/utils";
import { Autoresize } from "./Autoresize";

const { log } = console;

const USER_NAME_CN =
  "text-[34px] font-semibold uppercase leading-9 tracking-wide";

export const UserName = () => {
  const { ls } = usePersistentData();
  const { design } = useDesignContext();
  const c = useComponentContext();

  if (!ls.user) return <div className={cn("skeleton", USER_NAME_CN)} />;

  const userNameProps = {
    className: design.baseComponents?.userName?.className ?? USER_NAME_CN,
    value: ls.user.name,
    /**
     * Always passed for the `DndProvider` component.
     */
    ...c.hydratedProps,
  };

  return <Autoresize {...userNameProps} />;
};
