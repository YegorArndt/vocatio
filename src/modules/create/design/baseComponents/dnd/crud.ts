import { createContext, useContext } from "react";
import { BaseComponentType, SectionName } from "../../types";

export type AddComponentProps = {
  sectionId: SectionName;
  id: string;
  type: BaseComponentType;
  props: Record<string, unknown>;
};

export type RemoveComponentProps = {
  sectionId: SectionName;
  id: string;
};

type CrudContextType = {
  addComponent: (component: AddComponentProps) => void;
  removeComponent: (component: RemoveComponentProps) => void;
};

export const CrudContext = createContext({} as CrudContextType);

export const useCrudContext = () => {
  const context = useContext(CrudContext);
  return context;
};
