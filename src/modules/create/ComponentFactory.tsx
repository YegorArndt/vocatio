import { useDraftContext, type DraftComponent } from "../draft/DraftContext";

import { Autoresize } from "~/components/ui/inputs/components/Autoresize";
import { Timeline } from "~/modules/create/components/Timeline";
import { Heading } from "./components/Heading";
import { Group } from "./components/Group";

type ComponentFactoryProps = {
  component: DraftComponent;
};

export const ComponentFactory = (props: ComponentFactoryProps) => {
  const { component: c } = props;
  const { design } = useDraftContext();

  let Component:
    | typeof Heading
    | typeof Group
    | typeof Autoresize
    | typeof Timeline = Autoresize;

  const classNames =
    design.components[c.type as keyof typeof design.components];

  if (c.type.includes("heading")) Component = Heading;

  if (c.type === "group") Component = Group;

  if (c.type === "timeline") Component = Timeline;

  return <Component {...c.props} className={classNames} />;
};
