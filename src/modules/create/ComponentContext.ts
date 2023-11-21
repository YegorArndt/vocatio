import { createContext, useContext } from "react";
import type { DraftComponent } from "../draft/types/components";

export const ComponentContext = createContext({} as DraftComponent);

export const useComponentContext = () => {
  const context = useContext(ComponentContext);
  return context;
};
