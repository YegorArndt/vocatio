import { usePersistentData } from "~/hooks/usePersistentData";
import { useComponentContext } from "../contexts/ComponentContext";
import { useDesignContext } from "../contexts/DesignContext";
import { cn } from "~/utils";

const { log } = console;

const IMAGE_CN = "h-[200px] w-[200px] rounded-full";

export const UserImage = () => {
  const { ls } = usePersistentData();
  const { design } = useDesignContext();
  const c = useComponentContext();

  if (!ls.user) return <div className={cn("skeleton", IMAGE_CN)} />;

  const userImageProps = {
    className: design.baseComponents?.userImage?.className ?? IMAGE_CN,
    /**
     * Always passed for the `DndProvider` component.
     */
    ...c.hydratedProps,
  };

  return (
    <img
      src={ls.user.image}
      alt={ls.user.name}
      draggable={false}
      {...userImageProps}
    />
  );
};
