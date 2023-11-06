import { type Component, useDraftContext } from "../draft/DraftContext";
import cn from "classnames";

import { Input } from "~/components/ui/inputs/components/Input";
import { Autoresize } from "~/components/ui/inputs/components/Autoresize";
import {
  Timeline,
  type TimelineProps,
} from "~/components/ui/inputs/components/Timeline";

type ComponentFactoryProps = {
  component: Component;
} & Record<string, unknown>;

export const ComponentFactory = (props: ComponentFactoryProps) => {
  const { component: c } = props;
  const { downloadFired } = useDraftContext();

  const isTimeline = c.type === "timeline";

  if (isTimeline && c.props)
    return <Timeline {...(c.props as TimelineProps)} />;

  const isGroup = c.type === "group";

  if (isGroup) {
    const { label, value } = c.content as { label: string; value: string };
    return (
      <div className="grid grid-cols-[1fr,170px]">
        <Autoresize name={`label-${c.id}`} value={label} />
        <Autoresize name={`value-${c.id}`} value={value} />
      </div>
    );
  }

  // H4

  const isH4 = c.type === "h4";

  if (isH4) {
    return (
      <h3
        style={{ borderBottom: "2px solid currentColor" }}
        className={
          c.className
            ? c.className
            : cn(
                "mb-2 mt-2",
                {
                  "pb-3": downloadFired,
                },
                c.className
              )
        }
      >
        <Autoresize name={`${c.id}`} value={c.content as string} />
      </h3>
    );
  }

  // End of H4

  // H3
  const isH3 = c.type === "h3";

  if (isH3) {
    return (
      <div className="w-full text-[1.3rem] tracking-wider">
        <Input
          name={`${c.id}`}
          value={c.content as string}
          className="tracking-wider"
        />
      </div>
    );
  }

  // End of H3

  // H2

  const isH2 = c.type === "h2";

  if (isH2) {
    return (
      <h3 className="text-[1rem]">
        <Autoresize name={`${c.id}`} value={c.content as string} />
      </h3>
    );
  }

  // End of H2

  // H1

  const isH1 = c.type === "h1";

  if (isH1) {
    return (
      <div className="text-[50px] font-bold text-[#323B4C]">
        <Input name={`${c.id}`} value={c.content as string} />
      </div>
    );
  }

  // End of H1

  return <Autoresize name={`${c.id}`} value={c.content as string} />;
};
