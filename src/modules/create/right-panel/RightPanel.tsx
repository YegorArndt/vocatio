import { useEffect, useState } from "react";
import { DesignViewer } from "./DesignViewer";
import { SET_VIEW_EVENT } from "~/modules/init-gen/constants";
import { Bullets, type BulletsProps } from "./Bullets";
import { HydratableComponent } from "../design/types";
import { AnimatedDiv } from "~/components/AnimatedDiv";

type Views = "designs" | "bullets";
type SetViewEvent = CustomEvent<BulletsProps & { view: Views }>;

export const RightPanel = () => {
  const [view, setView] = useState("designs" as Views);
  const [component, setComponent] = useState({} as HydratableComponent);

  useEffect(() => {
    document.addEventListener(SET_VIEW_EVENT, (e) => {
      const { view, component } = (e as SetViewEvent).detail;
      setView(view);
      setComponent(component);
    });
  }, []);

  const mapping = {
    designs: <DesignViewer />,
    bullets: <Bullets component={component} />,
  };

  return (
    <AnimatedDiv className="border bg-secondary p-5">
      {mapping[view]}
    </AnimatedDiv>
  );
};
