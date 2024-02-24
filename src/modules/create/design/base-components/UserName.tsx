import { useComponentContext } from "../contexts/ComponentContext";
import { useDesignContext } from "../contexts/DesignContext";
import { api } from "~/utils";
import { Autoresize } from "./Autoresize";

const { log } = console;

const USER_NAME_CN =
  "text-[34px] font-semibold uppercase leading-9 tracking-wide";

export const UserName = () => {
  const { data: user } = api.users.get.useQuery();
  const { design } = useDesignContext();
  const c = useComponentContext();

  if (!user)
    return (
      <div className="flex-y gap-3">
        <div className="light-skeleton h-[40px] w-[150px] rounded-md" />
        <div className="light-skeleton h-[40px] w-[150px] rounded-md" />
      </div>
    );

  const userNameProps = {
    className: design.baseComponents?.userName?.className ?? USER_NAME_CN,
    value: user.name,
    /**
     * Always passed for the `DndProvider` component.
     */
    ...c.hydratedProps,
  };

  return <Autoresize {...userNameProps} />;
};
