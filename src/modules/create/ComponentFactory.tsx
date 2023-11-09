import { type DraftComponent } from "../draft/DraftContext";

import { Autoresize } from "~/components/ui/inputs/components/Autoresize";
import { Timeline } from "~/modules/create/components/Timeline";
import { Heading } from "./components/Heading";
import { Group } from "./components/Group";

type ComponentFactoryProps = {
  component: DraftComponent;
};

export const ComponentFactory = (props: ComponentFactoryProps) => {
  const { component: c } = props;

  let Component:
    | typeof Heading
    | typeof Group
    | typeof Autoresize
    | typeof Timeline;

  if (c.type === "heading") Component = Heading;
  if (c.type === "group") Component = Group;
  if (c.type === "timeline") Component = Timeline;
  if (c.type === "text") Component = Autoresize;

  return <Component {...c.props} />;
};
