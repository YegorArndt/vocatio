import { type CSSProperties } from "react";

import type { SectionId } from "./sections";
import type { Defaults } from "../utils/getDefaults";
import type { AutoresizeProps } from "~/modules/create/intrinsic/Autoresize";
import type { SharedGroupProps } from "~/modules/create/intrinsic/groups/types";
import type { DndProviderProps } from "~/modules/create/DndProvider";

export type ComponentToNormalize = RawComponent & {
  sectionId: SectionId;
};

type PropsInitializer = (data: Defaults) => Partial<NormalizedProps>;

export type NormalizedProps = Partial<
  AutoresizeProps & SharedGroupProps & DndProviderProps
> & {
  className: string;
  style: CSSProperties;
  tooltip: string;
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
  | "entries";
