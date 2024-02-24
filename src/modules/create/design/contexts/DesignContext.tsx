import React, {
  MutableRefObject,
  createContext,
  useContext,
  useRef,
  useState,
} from "react";
import { Design } from "../types";
import { Charmander } from "../designs/Charmander";
import { ImperativeHandleRef } from "../base-components/dnd/DndProvider";

const { log } = console;

type DesignContextInput = {
  children: (a: DesignContextOutput) => React.ReactNode;
  a4Ref: React.RefObject<HTMLDivElement>;
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

  const [design, setDesign] = useState<Design>(Charmander);

  const imperative = useRef<ImperativeHandleRef | null>(null);

  const changeDesign = (newDesign: Design) => {
    if (!imperative.current) return;

    setDesign(newDesign);
    imperative.current.updateSections(() => newDesign.sections);
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
