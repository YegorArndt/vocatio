import { createContext, useContext } from "react";
import { HydratableComponent } from "~/modules/create/design/types";

export const ComponentContext = createContext({} as HydratableComponent);

export const useComponentContext = () => {
  const context = useContext(ComponentContext);
  return context;
};
