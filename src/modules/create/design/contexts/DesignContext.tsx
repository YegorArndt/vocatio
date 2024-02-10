import React, { createContext, useContext, useState } from "react";
import { DraftContextInput } from "../../../../__archieved/draft/types";
import { Design } from "../types";
import { Charmander } from "../designs/Charmander";

const { log } = console;

type DesignContextInput = {
  children: (a: DesignContextOutput) => React.ReactNode;
  a4Ref: React.RefObject<HTMLDivElement>;
};

type DesignContextOutput = {
  a4Ref: DraftContextInput["a4Ref"];
  design: Design;
};

const Context = createContext({} as DesignContextOutput);

export const useDesignContext = () => {
  const design = useContext(Context);
  return design;
};

export const DesignContext = (props: DesignContextInput) => {
  const { children, a4Ref } = props;

  const [design, setDesign] = useState<Design>(Charmander);

  const context = {
    a4Ref,
    design,
  };

  return (
    <Context.Provider value={context}>{children(context)}</Context.Provider>
  );
};
