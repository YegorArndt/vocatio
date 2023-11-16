import { createContext, useContext } from "react";
import { DraftComponent } from "../draft/types";

export const ComponentContext = createContext({} as DraftComponent);

export const useComponentContext = () => {
  const context = useContext(ComponentContext);
  return context;
};
