import { type CSSProperties } from "react";

import type { SectionId } from "./sections";
import { ListProps } from "~/modules/create/intrinsic/List";
import { Defaults } from "../utils/getDefaults";
import { AutoresizeProps } from "~/modules/create/intrinsic/Autoresize";
import { SharedGroupProps } from "~/modules/create/intrinsic/groups/types";
import { DndProviderProps } from "~/modules/create/DndProvider";

export type ComponentToNormalize = RawComponent & {
  sectionId: SectionId;
};

type Initializer = (data: Defaults) => Partial<NormalizedProps>;

export type NormalizedProps = Partial<
  ListProps & AutoresizeProps & SharedGroupProps & DndProviderProps
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
  props?: Partial<NormalizedProps> | Initializer;
};

export type NormalizedType =
  | "text"
  | `heading-${number}`
  | "group"
  | "divider"
  | "url"
  | "image"
  | "icon-group"
  | "entries";
