import { MutableRefObject } from "react";
import { HydrationData, HydratableComponent } from "../../types";
import { ImperativeHandleRef } from "../dnd/DndProvider";

const { log } = console;

export type Imperative = ImperativeHandleRef | null;

export const setter = (
  data: HydrationData,
  imperative: MutableRefObject<Imperative>,
  c: HydratableComponent
) => {
  if (!imperative.current) return;

  imperative.current.updateSections(() => {
    const { sections } = c.hydratableProps!(data);
    return sections;
  });
};
