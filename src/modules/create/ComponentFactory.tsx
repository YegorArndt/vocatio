import { Group } from "./components/Group";
import { Divider } from "./components/Divider";
import { UserImage } from "./components/UserImage";
import { useComponentContext } from "./ComponentContext";
import { Autoresize } from "./components/Autoresize";
import { List } from "./components/List";

const componentMapping = {
  text: Autoresize,
  group: Group,
  divider: Divider,
  image: UserImage,
  list: List,
};

export const ComponentFactory = () => {
  const { type, props } = useComponentContext();

  const Component =
    componentMapping[type as keyof typeof componentMapping] || Autoresize;

  return <Component {...props} />;
};
