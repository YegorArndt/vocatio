import type { AutoresizeProps } from "~/modules/create/components/Autoresize";
import type { ListProps } from "~/modules/create/components/List";
import type { DividerProps } from "~/modules/create/components/Divider";
import type { GroupProps } from "~/modules/create/components/Group";
import type { ImageProps } from "~/modules/create/components/UserImage";
import type { SectionId } from "./sections";
import { dbIds } from "../constants";
import { type CSSProperties } from "react";

export type TypeOfComponent = keyof DraftComponents;

export type DraftComponents = { [P in Text["type"]]: Text } & {
  [P in Heading["type"]]: Heading;
} & { [P in Group["type"]]: Group } & { [P in Divider["type"]]: Divider } & {
  [P in List["type"]]: List;
} & { [P in Url["type"]]: Url } & { [P in Image["type"]]: Image };

export type IntrinsicDesignComponents = Partial<
  Record<
    TypeOfComponent,
    AutoresizeProps | ListProps | GroupProps | DividerProps | ImageProps
  >
>;

export type DraftComponent = DraftComponents[keyof DraftComponents] &
  Obligatory;

type Obligatory = {
  id: string | (typeof dbIds)[number];
  sectionId: SectionId;
  order: number;
  isDecoration: boolean;
};

type ObligatoryProps = {
  className: string;
  style: CSSProperties;
  value: string;
};

export type Text = {
  type: "text";
  props: Omit<AutoresizeProps & ObligatoryProps, "id">;
};

export type Heading = {
  type: `heading-${number}`;
  props: Omit<AutoresizeProps & ObligatoryProps, "id">;
};

export type Group = {
  type: "group";
  props: Omit<GroupProps & ObligatoryProps, "id">;
};

export type Divider = {
  type: "divider";
  props: Omit<DividerProps & ObligatoryProps, "id">;
};

export type List = {
  type: "list";
  props: Omit<ListProps & ObligatoryProps, "id">;
};

export type Url = {
  type: "url";
  props: Omit<AutoresizeProps, "id">;
};

export type Image = {
  type: "image";
  props: Omit<ImageProps & ObligatoryProps, "id">;
};
