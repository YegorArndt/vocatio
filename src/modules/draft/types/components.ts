import { type CSSProperties } from "react";

import type { SectionId } from "./sections";
import type { AutoresizeProps } from "~/modules/draft/intrinsic/Autoresize";
import type { DndProviderProps } from "~/modules/draft/components/DndProvider";
import { GroupProps } from "~/modules/draft/intrinsic/Group";
import { LsDraft } from ".";

/**
 * Each component must have: value, label, icon, type, id.
 */

export type ComponentToNormalize = RawComponent & {
  sectionId: SectionId;
};

type PropsInitializer = (data: LsDraft) => Partial<NormalizedProps>;

export type NormalizedProps = Partial<
  AutoresizeProps & GroupProps & DndProviderProps
> & {
  className: string;
  style: CSSProperties;
  tooltip?: string;
};

export type NormalizedComponent = {
  id: string;
  type: NormalizedType;
  sectionId: SectionId;
  props: NormalizedProps;
};

export type RawComponent = Pick<NormalizedComponent, "type" | "id"> & {
  props?: Partial<NormalizedProps> | PropsInitializer;
};

export type NormalizedType =
  | "text"
  | `heading-${number}`
  | "group"
  | "divider"
  | "image"
  | "icon-group"
  | "entries"
  | "context";
