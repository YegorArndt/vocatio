import { type CSSProperties } from "react";

import type { AutoresizeProps } from "~/modules/create/cv-components/Autoresize";
import type { DividerProps } from "~/modules/create/cv-components/Divider";
import type { GroupProps } from "~/modules/create/cv-components/Group";
import type { ImageProps } from "~/components/UserImage";
import type { SectionId } from "./sections";
import type { ListProps } from "~/modules/create/cv-components/List";
import { IconGroupProps } from "~/modules/create/cv-components/IconGroup";
import { NameProps } from "~/modules/create/cv-components/Name";

export type TypeOfComponent = keyof NormalizedComponents;

export type ComponentValue =
  | string
  | number
  | null
  | undefined
  | {
      id: string;
      date: AutoresizeProps;
      place: AutoresizeProps;
      heading: AutoresizeProps;
      story: AutoresizeProps;
      className?: string;
    }[]
  | NameProps;

export type NormalizedComponents = { [P in Text["type"]]: Text } & {
  [P in Heading["type"]]: Heading;
} & { [P in Group["type"]]: Group } & { [P in Divider["type"]]: Divider } & {
  [P in List["type"]]: List;
} & { [P in Url["type"]]: Url } & { [P in Image["type"]]: Image } & {
  [P in DecoratedTimeline["type"]]: DecoratedTimeline;
} & { [P in IconGroup["type"]]: IconGroup } & { [P in Name["type"]]: Name };

export type NormalizedComponent =
  NormalizedComponents[keyof NormalizedComponents] &
    Obligatory & {
      props: ObligatoryProps &
        NormalizedComponents[keyof NormalizedComponents]["props"];
    }; // obl missing in normalizedcomponents

export type Obligatory = {
  // id: string | (typeof dbIds)[number];
  id: string;
  sectionId: SectionId;
  order: number;
};

export type ObligatoryProps = {
  className: string;
  style: CSSProperties;
  value: ComponentValue;
  label: string;
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

export type DecoratedTimeline = {
  type: "decorated-timeline";
  props: Omit<ImageProps & ObligatoryProps, "id">;
};

export type IconGroup = {
  type: "icon-group";
  props: Omit<IconGroupProps & ObligatoryProps, "id">;
};

export type Name = {
  type: "name";
  props: Omit<NameProps & ObligatoryProps, "id">;
};

export type RawComponent = Omit<Partial<NormalizedComponent>, "props"> & {
  id: string;
  type: TypeOfComponent;
  props?: Partial<NormalizedComponent["props"]>;
};
