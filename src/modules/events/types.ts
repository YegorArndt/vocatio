import {
  RemoveComponentProps,
  AddComponentProps,
} from "../create/design/base-components/dnd/crud";
import { Sections } from "../create/design/types";
import { ExperienceContext } from "../create/tailor/tailorExperience";
import { SkillsContext } from "../create/tailor/tailorSkills";

export enum Events {
  GEN_UPDATED = "gen-updated",
  DOWNLOAD_FIRED = "download-fired",
  DESIGN_CHANGED = "design-changed",
  ON_LOAD = "on-load",
  SETTINGS_UPDATED = "settings-updated",
  THEME_UPDATED = "theme-updated",
}

export enum PopoverEvents {
  SKILLS_UPDATED = "skills-updated",
  BULLETS_UPDATED = "bullets-updated",
  EXPERIENCE_UPDATED = "experience-updated",
  ENTRY_ADDED = "entry-added",
  BOLDEN_SUMMARY = "bolden-summary",
  BOLDEN_BULLETS = "bolden-bullets",
}

export type EventHandler<Detail> = (event?: CustomEvent<Detail>) => void;

/**
 * Details.
 */
export type ComponentRemovalDetail = {
  component: RemoveComponentProps;
  newSections: Sections;
};
export type ComponentAdditionDetail = {
  component: AddComponentProps;
  newSections: Sections;
};
export type CvSubset = SkillsContext | ExperienceContext;
