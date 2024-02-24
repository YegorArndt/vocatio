import { useComponentContext } from "../contexts/ComponentContext";
import { useDesignContext } from "../contexts/DesignContext";
import { api, cn } from "~/utils";

const { log } = console;

const IMAGE_CN = "h-[140px] w-[140px] rounded-full";

export const UserImage = () => {
  const { data: user } = api.users.get.useQuery();

  const { design } = useDesignContext();
  const c = useComponentContext();

  if (!user) return <div className={cn("light-skeleton", IMAGE_CN)} />;

  const userImageProps = {
    className: design.baseComponents?.userImage?.className ?? IMAGE_CN,
    /**
     * Always passed for the `DndProvider` component.
     */
    ...c.hydratedProps,
  };

  return <img src={user.image} draggable={false} {...userImageProps} />;
};
