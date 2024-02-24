import {
  AddComponentProps,
  RemoveComponentProps,
} from "./create/design/base-components/dnd/crud";
import { Sections } from "./create/design/types";
import {
  GeneratedData,
  GeneratedExperienceEntry,
  GeneratedSkills,
} from "./init-gen/types";

const { log } = console;

/**
 * Skills.
 */
export type SkillsUpdatedDetail = GeneratedSkills;
export type GeneratedDataUpdatedDetail = GeneratedData;

/**
 * Experience.
 */
export type ExperienceGeneratedDetail = GeneratedExperienceEntry[];
export type AddBulletPoint = {
  bullet: string;
  entry: GeneratedExperienceEntry;
};
export type ExperienceEntryAddedDetail = GeneratedExperienceEntry;

/**
 * General.
 */
export type ComponentRemovalDetail = {
  component: RemoveComponentProps;
  newSections: Sections;
};
export type ComponentAdditionDetail = {
  component: AddComponentProps;
  newSections: Sections;
};

export enum Events {
  /**
   * Skills.
   */
  SKILLS_UPDATED_EVENT = "skills-updated",
  /**
   * Experience.
   */
  EXPERIENCE_GENERATED_EVENT = "experience-generated",
  ADD_BULLET_TO_ENTRY_EVENT = "add-bullet-to-entry",
  EXPERIENCE_ENTRY_ADDED_BY_USER_EVENT = "experience-entry-added-by-user",
  /**
   * General.
   */
  GENERATED_DATA_UPDATED = "generated-data-updated",
  COMPONENT_REMOVED_EVENT = "component-removed",
  COMPONENT_ADDED_EVENT = "component-added",

  /**
   * Download.
   */
  DOWNLOAD_CV_EVENT = "download-cv-event",
}

export type EventHandler<T> = (event: CustomEvent<T>) => void;

class EventManager {
  private eventHandlers: Map<Events, EventHandler<any>[]>;

  constructor() {
    this.eventHandlers = new Map();
  }

  on<T>(eventName: Events, handler: EventHandler<T>) {
    const handlers = this.eventHandlers.get(eventName) || [];
    handlers.push(handler);
    this.eventHandlers.set(eventName, handlers);
    document.addEventListener(eventName, handler as EventListener);
  }

  off<T>(eventName: Events, handler: EventHandler<T>) {
    const handlers = this.eventHandlers.get(eventName);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index !== -1) {
        handlers.splice(index, 1);
      }
    }
    document.removeEventListener(eventName, handler as EventListener);
  }

  emit<T>(eventName: Events, detail: T) {
    const event = new CustomEvent<T>(eventName, { detail });
    document.dispatchEvent(event);
  }
}

export const eventManager = new EventManager();
