import {
  type MutableRefObject,
  type ReactNode,
  type RefObject,
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
} from "react";

import type { Design } from "../types";
import { type ImperativeHandleRef } from "../base-components/dnd/DndProvider";
import { eventManager } from "~/modules/events/EventManager";
import { Events } from "~/modules/events/types";
import { getSettings } from "~/modules/settings/settings";
import { designs } from "../../DesignViewer";

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

  const [design, setDesign] = useState<Design | null>(null);

  useEffect(() => {
    const settings = getSettings();
    const { defaultDesign } = settings;
    if (defaultDesign) {
      setDesign(designs[defaultDesign]);
    }
  }, []);

  const imperative = useRef<ImperativeHandleRef | null>(null);

  const changeDesign = (newDesign: Design) => {
    if (!imperative.current) return;
    setDesign(newDesign);
    imperative.current.updateSections(() => newDesign.sections);
    eventManager.emit(Events.DESIGN_CHANGED);
  };

  if (!design) return null;

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
