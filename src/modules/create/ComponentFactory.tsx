import { useDraftContext } from "../draft/DraftContext";
import { Autoresize } from "~/components/ui/inputs/components/Autoresize";
import { Timeline } from "~/modules/create/timeline";
import { Group } from "./components/Group";
import type { DraftComponent, Timeline as TimelineType } from "../draft/types";
import { Divider } from "./components/Divider";
import { Heading } from "./components/Heading";
import { UserImage } from "./components/UserImage";

type ComponentFactoryProps = {
  component: DraftComponent;
};

let Component:
  | typeof Group
  | typeof Autoresize
  | typeof Divider
  | typeof Heading
  | typeof UserImage
  | typeof Timeline
  | null = null;

export const ComponentFactory = (props: ComponentFactoryProps) => {
  const { component: c } = props;
  const { design } = useDraftContext();
  const { type, id, props: componentProps } = c;

  const { className, ...designPropsWithoutClassName } =
    design.components[type]!;
  const { className: componentClassName, ...componentPropsWithoutClassName } =
    componentProps;

  const mergedClassNames = [className, componentClassName, type]
    .filter(Boolean)
    .join(" ");

  const merged = {
    ...designPropsWithoutClassName,
    ...componentPropsWithoutClassName,
    className: mergedClassNames,
  };

  if (type.includes("heading")) Component = Heading;
  if (type === "text") Component = Autoresize;
  if (type === "group") Component = Group;
  if (type === "divider") Component = Divider;
  if (type === "timeline") Component = Timeline;
  if (type === "image") Component = UserImage;

  if (Component)
    return <Component id={id} {...(merged as typeof merged & TimelineType)} />;

  return null;
};
