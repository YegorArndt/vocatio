import { useDraftContext } from "../draft/DraftContext";
import { Autoresize } from "~/components/ui/inputs/components/Autoresize";
import { Timeline } from "~/modules/create/timeline";
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

  if (c.type === "timeline") {
    const timelineProps = { ...design.components.timeline, ...c.props };
    console.log("factory", timelineProps);
    return <Timeline {...timelineProps} />;
  }

  let Component:
    | typeof Group
    | typeof Autoresize
    | typeof Divider
    | typeof Heading
    | null = null;

  const designClassNames = design.components[c.type];
  const componentClassNames = c.props.className;
  const merged = [designClassNames, componentClassNames].join(" ");

  if (c.type.includes("heading")) Component = Heading;
  if (c.type === "text") Component = Autoresize;
  if (c.type === "group") Component = Group;
  if (c.type === "divider") Component = Divider;

  if (Component) return <Component id={c.id} {...c.props} className={merged} />;

  return null;
};
