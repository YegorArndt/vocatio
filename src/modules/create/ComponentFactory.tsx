import { Group } from "./components/Group";
import { Divider } from "./components/Divider";
import { UserImage } from "./components/UserImage";
import { useComponentContext } from "./ComponentContext";
import { Autoresize } from "./components/Autoresize";
import { List } from "./components/List";
import { useDraftContext } from "../draft/DraftContext";
import type {
  ComponentValue,
  NormalizedComponent,
} from "../draft/types/components";
import type { Design } from "../draft/types/design";
import { DecoratedTimeline } from "./components/DecoratedTimeline";
import { IconGroup } from "./components/IconGroup";

const componentMapping = {
  text: Autoresize,
  group: Group,
  "icon-group": IconGroup,
  divider: Divider,
  image: UserImage,
  list: List,
  "decorated-timeline": DecoratedTimeline,
};

/**
 * Merging with intrinsic props must happen at this stage.
 * This is because the intrinsic props might change when the user changes component's type.
 * So the props need to be recalculated dynamically.
 */

const mergeWithIntrinsic = (c: NormalizedComponent, d: Design) => {
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

  const merged = mergeWithIntrinsic(c, design) as { value: ComponentValue };

  const Component =
    componentMapping[c.type as keyof typeof componentMapping] || Autoresize;

  return <Component id={c.id} {...merged} />;
};
