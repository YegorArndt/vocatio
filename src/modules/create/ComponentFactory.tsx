import { useDraftContext } from "../draft/DraftContext";
import { Autoresize } from "~/components/ui/inputs/components/Autoresize";
import { Timeline, TimelineProps } from "~/modules/create/timeline";
import { Group } from "./components/Group";
import type { DraftComponent } from "../draft/types";
import { Divider } from "./components/Divider";
import { Heading } from "./components/Heading";

type ComponentFactoryProps = {
  component: DraftComponent;
};

export const ComponentFactory = (props: ComponentFactoryProps) => {
  const { component: c } = props;
  const { design } = useDraftContext();

  let Component:
    | typeof Group
    | typeof Autoresize
    | typeof Divider
    | typeof Heading
    | null = null;

  const designClassNames = design.components[c.type];

  if (c.type.includes("heading")) Component = Heading;
  if (c.type === "text") Component = Autoresize;
  if (c.type === "group") Component = Group;
  if (c.type === "divider") Component = Divider;

  if (Component) return <Component {...c.props} className={designClassNames} />;

  return <Timeline {...(c.props as unknown as TimelineProps)} />;
};
