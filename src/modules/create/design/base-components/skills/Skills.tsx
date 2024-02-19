import { useEffect, useRef } from "react";

import { DndProvider, ImperativeHandleRef } from "../dnd/DndProvider";
import { useComponentContext } from "../../contexts/ComponentContext";
import { useDesignContext } from "../../contexts/DesignContext";
import { cn } from "~/utils";
import {
  eventManager,
  Events,
  EventHandler,
  SkillsUpdatedDetail,
  GeneratedDataUpdatedDetail,
  ComponentRemovalDetail,
  ComponentAdditionDetail,
} from "~/modules/EventManager";
import { useVacancyId } from "~/hooks/useVacancyId";
import {
  Items,
  LocalStorageManager,
  LsSkills,
} from "~/modules/LocalStorageManager";
import { GeneratedSkills } from "~/modules/init-gen/types";

const { log } = console;

type EventHandlers = {
  onGenerated: EventHandler<GeneratedDataUpdatedDetail>;
  onUpdated: EventHandler<SkillsUpdatedDetail>;
  onRemove: EventHandler<ComponentRemovalDetail>;
  onAdd: EventHandler<ComponentAdditionDetail>;
};

const useEvents = (props: EventHandlers) => {
  const { onGenerated, onUpdated, onRemove, onAdd } = props;

  useEffect(() => {
    eventManager.on<GeneratedDataUpdatedDetail>(
      Events.GENERATED_DATA_UPDATED,
      onGenerated
    );

    return () => {
      eventManager.off(Events.SKILLS_UPDATED_EVENT, onGenerated);
    };
  }, []);

  useEffect(() => {
    eventManager.on<SkillsUpdatedDetail>(
      Events.SKILLS_UPDATED_EVENT,
      onUpdated
    );

    return () => {
      eventManager.off(Events.SKILLS_UPDATED_EVENT, onUpdated);
    };
  }, []);

  useEffect(() => {
    eventManager.on<ComponentRemovalDetail>(
      Events.COMPONENT_REMOVED_EVENT,
      onRemove
    );
  }, []);

  useEffect(() => {
    eventManager.on<ComponentAdditionDetail>(
      Events.COMPONENT_ADDED_EVENT,
      onAdd
    );
  }, []);
};

export const Skills = () => {
  const { design } = useDesignContext();
  const c = useComponentContext();
  const vacancyId = useVacancyId();

  const imperative = useRef<ImperativeHandleRef | null>(null);

  const setter = (skills: SkillsUpdatedDetail) => {
    if (!imperative.current) return;

    imperative.current.updateSections(() => {
      const { sections } = c.hydratableProps!({
        generatedSkills: skills,
      });

      return sections;
    });
  };

  useEvents({
    onGenerated: (e) => {
      setter(e.detail.generatedSkills);
      LocalStorageManager.getInstance().setItem(
        Items.SKILLS,
        e.detail.generatedSkills
      );
    },
    onUpdated: (e) => {
      setter(e.detail);
      LocalStorageManager.getInstance().setItem(Items.SKILLS, e.detail);
    },
    onRemove: (e) => {
      const { component } = e.detail;
      const currentSkills = LocalStorageManager.getInstance().getItem<LsSkills>(
        Items.SKILLS
      );

      if (!currentSkills) return;

      const filtered = currentSkills.filter((s) => s.id !== component.id);

      LocalStorageManager.getInstance().setItem(Items.SKILLS, filtered);
      setter(filtered);
    },
    onAdd: (e) => {
      const { component, newSections } = e.detail;

      if (component.sectionId !== "skills") return;

      const index = newSections.skills?.components.findIndex(
        (c) => c.id === component.id
      );

      const skillName = component.props.value as string;

      const newSkill = { name: skillName, id: component.id };

      const currentSkills = LocalStorageManager.getInstance().getItem<LsSkills>(
        Items.SKILLS
      );

      if (!currentSkills) return;

      const updatedSkills = [
        ...currentSkills.slice(0, index),
        newSkill,
        ...currentSkills.slice(index),
      ];

      LocalStorageManager.getInstance().setItem(Items.SKILLS, updatedSkills);
      setter(updatedSkills);
    },
  });

  useEffect(() => {
    if (!vacancyId) return;

    const lsSkills = LocalStorageManager.getInstance().getItem<GeneratedSkills>(
      Items.SKILLS
    );

    if (lsSkills) setter(lsSkills);
  }, [vacancyId]);

  const className = cn(
    design.baseComponents?.skills?.className,
    "skills-section"
  );

  return <DndProvider ref={imperative} sections={{}} className={className} />;
};
