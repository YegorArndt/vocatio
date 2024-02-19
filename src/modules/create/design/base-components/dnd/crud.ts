import { Dispatch, SetStateAction, createContext, useContext } from "react";
import { BaseComponentType, SectionName, Sections } from "../../types";
import { omit } from "lodash-es";
import { uuidv4 } from "~/modules/utils";
import { Events, eventManager } from "~/modules/EventManager";

const { log } = console;

export type AddComponentProps = {
  sectionId: SectionName;
  type: BaseComponentType;
  props: Record<string, unknown>;
  id: string;
};

export type RemoveComponentProps = {
  sectionId: SectionName;
  id: string;
};

type CrudContextType = {
  addComponent: ReturnType<typeof addComponent>;
  removeComponent: ReturnType<typeof removeComponent>;
  setSections: Dispatch<SetStateAction<Sections>>;
};

export const CrudContext = createContext({} as CrudContextType);

export const useCrudContext = () => {
  const context = useContext(CrudContext);
  return context;
};

export const addComponent =
  (setSections: Dispatch<SetStateAction<Sections>>, activeId: string | null) =>
  (baseComponent: AddComponentProps) =>
    setSections((prev) => {
      const { sectionId } = baseComponent;

      const section = prev[sectionId];

      if (!section) return prev;

      const newSections = { ...prev };

      const index = section.components.findIndex(
        (c) => c.id === activeId || c.id === baseComponent.id
      );

      newSections[sectionId]!.components = [
        ...section.components.slice(0, index + 1),
        {
          ...omit(baseComponent, "props"),
          hydratedProps: {
            ...baseComponent.props,
          },
          id: baseComponent.id.includes("bullet")
            ? uuidv4() + "-bullet"
            : uuidv4(),
        },
        ...section.components.slice(index + 1),
      ];

      eventManager.emit(Events.COMPONENT_ADDED_EVENT, {
        component: baseComponent,
        newSections,
      });

      return newSections;
    });

export const removeComponent =
  (setSections: Dispatch<SetStateAction<Sections>>) =>
  (component: RemoveComponentProps) =>
    setSections((prev) => {
      const { sectionId } = component;

      const section = prev[sectionId];

      if (!section) return prev;

      const newSections = { ...prev };

      newSections[sectionId]!.components = section.components.filter(
        (c) => c.id !== component.id
      );

      eventManager.emit(Events.COMPONENT_REMOVED_EVENT, {
        component,
        newSections,
      });

      return newSections;
    });
