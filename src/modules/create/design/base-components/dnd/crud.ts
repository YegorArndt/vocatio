import { Dispatch, SetStateAction, createContext, useContext } from "react";
import { BaseComponentType, SectionName, Sections } from "../../types";
import { omit } from "lodash-es";
import { uuidv4 } from "~/modules/utils";
import { PopoverEvents } from "~/modules/events/types";
import { CvContextManager } from "~/modules/CvContextManager";
import { BulletPoint } from "~/modules/init-gen/types";
import { eventManager } from "~/modules/events/EventManager";

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

const handleCvContext = (
  newSections: Sections,
  component: RemoveComponentProps
) => {
  let eventType: PopoverEvents | null = null;

  if (component.sectionId.includes("skills")) {
    eventType = PopoverEvents.SKILLS_UPDATED;
    updateSkills(newSections);
  }

  if (component.id.includes("bullet")) {
    eventType = PopoverEvents.EXPERIENCE_UPDATED;
    updateBullets(newSections);
  }

  if (!eventType) return;

  eventManager.emit(eventType);
};

const updateSkills = (newSections: Sections) => {
  const { components } = newSections.skills || {};
  if (!components) return;

  CvContextManager.getInstance().updateCv((prev) => {
    const formatted = components.map((c) => ({
      id: c.id,
      name: c.hydratedProps?.value || "",
    }));

    return {
      ...prev,
      skills: formatted,
    };
  });
};

const updateBullets = (newSections: Sections) => {
  const firstKey = Object.keys(newSections)[0];
  if (!firstKey) return;
  const { components } = newSections[firstKey]!;

  CvContextManager.getInstance().updateCv((prev) => {
    const entries = prev.experience;
    const target = entries.find((e) => e.id === firstKey);

    if (!target) return prev;

    const newBullets = components.filter((c) => c.id.includes("bullet"));
    const formatted: BulletPoint[] = newBullets.map((b) => ({
      id: b.id,
      value: b.hydratedProps?.value || "",
    }));
    const newEntry = { ...target, bullets: formatted };
    const newEntries = entries.map((e) =>
      e.id === newEntry.id ? newEntry : e
    );

    return {
      ...prev,
      experience: newEntries,
    };
  });
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

      handleCvContext(newSections, baseComponent);

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

      handleCvContext(newSections, component);

      return newSections;
    });
