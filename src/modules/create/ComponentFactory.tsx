import { Group } from "./components/Group";
import { Divider } from "./components/Divider";
import { UserImage } from "./components/UserImage";
import { useComponentContext } from "./ComponentContext";
import { Autoresize } from "./components/Autoresize";
import { List } from "./components/List";
import { Design } from "../draft/types";
import { DraftComponent } from "../draft/types/components";
import { useDraftContext } from "../draft/DraftContext";

const componentMapping = {
  text: Autoresize,
  group: Group,
  divider: Divider,
  image: UserImage,
  list: List,
};

/**
 * Merging with intrinsic props must happen at this stage.
 * This is because the intrinsic props might change when the user changes component's type.
 * So the props need to be recalculated dynamically.
 */

const mergeWithIntrinsic = (c: DraftComponent, d: Design) => {
  const { intrinsic } = d;
  const intrinsicComponent = intrinsic[c.type];
  if (!intrinsicComponent) return c.props;

  const { className: k, style: s } = c.props;

  const className = `${c.type} ${intrinsicComponent.className || ""} ${k}`;
  const style = { ...intrinsicComponent.style, ...s };

  return { ...intrinsicComponent, ...c.props, className, style };
};

export const ComponentFactory = () => {
  const c = useComponentContext();
  const { design } = useDraftContext();

  const merged = mergeWithIntrinsic(c, design);

  const Component =
    componentMapping[c.type as keyof typeof componentMapping] || Autoresize;

  return <Component id={c.id} {...merged} />;
};
