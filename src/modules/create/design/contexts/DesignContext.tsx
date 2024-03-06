import {
  type MutableRefObject,
  type ReactNode,
  type RefObject,
  createContext,
  useContext,
  useRef,
  useState,
} from "react";

import type { Design } from "../types";
import { type ImperativeHandleRef } from "../base-components/dnd/DndProvider";
import { eventManager } from "~/modules/events/EventManager";
import { Events } from "~/modules/events/types";
import { Charizard } from "../designs/Charizard";

const { log } = console;

type DesignContextInput = {
  children: (a: DesignContextOutput) => ReactNode;
  a4Ref: RefObject<HTMLDivElement>;
};

type DesignContextOutput = {
  a4Ref: DesignContextInput["a4Ref"];
  design: Design;
  changeDesign: (newDesign: Design) => void;
  imperative: MutableRefObject<ImperativeHandleRef | null>;
};

const Context = createContext({} as DesignContextOutput);

export const useDesignContext = () => {
  const design = useContext(Context);
  return design;
};

export const DesignContext = (props: DesignContextInput) => {
  const { children, a4Ref } = props;

  const [design, setDesign] = useState<Design>(Charizard);

  const imperative = useRef<ImperativeHandleRef | null>(null);

  const changeDesign = (newDesign: Design) => {
    if (!imperative.current) return;
    setDesign(newDesign);
    imperative.current.updateSections(() => newDesign.sections);
    eventManager.emit(Events.DESIGN_CHANGED);
  };

  const context = {
    a4Ref,
    design,
    changeDesign,
    imperative,
  };

  return (
    <Context.Provider value={context}>{children(context)}</Context.Provider>
  );
};
