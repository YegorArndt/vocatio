import { createContext, useContext } from "react";
import type { NormalizedComponent } from "../draft/types/components";

export const ComponentContext = createContext({} as NormalizedComponent);

export const useComponentContext = () => {
  const context = useContext(ComponentContext);
  return context;
};
