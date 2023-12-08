import { type CSSProperties } from "react";

import type { SectionId } from "./sections";
import { ListProps } from "~/modules/create/intrinsic/List";
import { Defaults } from "../utils/getDefaults";
import { AutoresizeProps } from "~/modules/create/intrinsic/Autoresize";
import { SharedGroupProps } from "~/modules/create/intrinsic/groups/types";

type Initializer = (
  data: Defaults,
  prevProps: NormalizedProps
) => Partial<NormalizedProps>;

export type NormalizedProps = {
  className: string;
  style: CSSProperties;
} & Partial<ListProps & AutoresizeProps & SharedGroupProps>;

export type NormalizedComponent = {
  id: string;
  type: NormalizedType;
  sectionId: SectionId;
  order: number;
  props: NormalizedProps;
};

export type RawComponent = Pick<NormalizedComponent, "type" | "id"> & {
  props?: Partial<NormalizedProps>;
  initializer?: Initializer;
};

export type NormalizedType =
  | "text"
  | `heading-${number}`
  | "group"
  | "divider"
  | "list"
  | "url"
  | "image"
  | "decorated-timeline"
  | "icon-group"
  | "name";
