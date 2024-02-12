import { useEffect, useState } from "react";
import { DesignViewer } from "./DesignViewer";
import { HydratableComponent } from "../design/types";
import { AnimatedDiv } from "~/components/AnimatedDiv";
import { AddBulletsViewer, AddBulletsViewerProps } from "./AddBulletsViewer";
import { SET_RIGHT_PANEL_VIEW_EVENT } from "~/modules/events";

const { log } = console;

type Views = "designs" | "bullets";
type SetViewEvent = CustomEvent<AddBulletsViewerProps & { view: Views }>;

export const RightPanel = () => {
  const [view, setView] = useState("designs" as Views);
  const [component, setComponent] = useState({} as HydratableComponent);

  useEffect(() => {
    document.addEventListener(SET_RIGHT_PANEL_VIEW_EVENT, (e) => {
      const { view, component } = (e as SetViewEvent).detail;
      setView(view);
      setComponent(component);
    });
  }, []);

  const mapping = {
    designs: <DesignViewer />,
    bullets: <AddBulletsViewer component={component} />,
  };

  return (
    <AnimatedDiv className="border bg-secondary p-5">
      {mapping[view]}
    </AnimatedDiv>
  );
};
