import Image from "next/image";

import { useDraftContext } from "../draft/DraftContext";
import { Autoresize } from "~/components/ui/inputs/components/Autoresize";
import { Timeline } from "~/modules/create/timeline";
import { Group } from "./components/Group";
import type { DraftComponent } from "../draft/types";
import { Divider } from "./components/Divider";
import { Heading } from "./components/Heading";
import { UserImage } from "./components/UserImage";

type ComponentFactoryProps = {
  component: DraftComponent;
};

export const ComponentFactory = (props: ComponentFactoryProps) => {
  const { component: c } = props;
  const { design } = useDraftContext();
  const { type, id, props: componentProps } = c;

  let Component:
    | typeof Group
    | typeof Autoresize
    | typeof Divider
    | typeof Heading
    | typeof Image
    | typeof Timeline
    | null = null;

  const { className, ...designPropsWithoutClassName } = design.components[type];
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

  if (Component) return <Component id={id} {...merged} />;

  return null;
};
