import { useEffect, useState } from "react";
import { DesignViewer } from "./DesignViewer";
import { HydratableComponent } from "../design/types";
import { AnimatedDiv } from "~/components/AnimatedDiv";
import { cn } from "~/utils";
import { SET_RIGHT_PANEL_VIEW_EVENT } from "~/modules/constants";
import { AddBulletsViewer, AddBulletsViewerProps } from "./AddBulletsViewer";

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
    <AnimatedDiv
      className={cn("border bg-secondary p-5", {
        // fixed: view === "bullets",
      })}
    >
      {mapping[view]}
    </AnimatedDiv>
  );
};
