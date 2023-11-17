import { useDraftContext } from "../draft/DraftContext";
import { Autoresize } from "~/components/ui/inputs/components/Autoresize";
import { Timeline } from "~/modules/create/timeline";
import { Group } from "./components/Group";
import type { Timeline as TimelineType } from "../draft/types";
import { Divider } from "./components/Divider";
import { Heading } from "./components/Heading";
import { UserImage } from "./components/UserImage";
import { useComponentContext } from "./ComponentContext";

let Component:
  | typeof Group
  | typeof Autoresize
  | typeof Divider
  | typeof Heading
  | typeof UserImage
  | typeof Timeline
  | null = null;

export const ComponentFactory = () => {
  const { design } = useDraftContext();
  const c = useComponentContext();
  const { type, id, props: componentProps, sectionId } = c;

  const { className, style, ...designPropsWithoutClassName } =
    design.components[type]!;
  const {
    className: componentClassName,
    style: componentStyle,
    ...componentPropsWithoutClassName
  } = componentProps;

  const mergedClassNames = [className, componentClassName, type]
    .filter(Boolean)
    .join(" ");

  const mergedStyles = {
    ...style,
    ...componentStyle,
  };

  const merged = {
    ...designPropsWithoutClassName,
    ...componentPropsWithoutClassName,
    style: mergedStyles,
    className: mergedClassNames,
    sectionId,
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
