// import { type CSSProperties } from "react";

// import type { SectionId } from "./sections";
// import type { DndProviderProps } from "~/modules/create/design/baseComponents/DndProvider";
// import { GroupProps } from "~/modules/create/design/baseComponents/Group";
// import { GeneratedDraft } from ".";

// /**
//  * Each component must have: value, label, icon, type, id.
//  */

// export type PropsInitializer = (
//   data: GeneratedDraft
// ) => Partial<NormalizedProps>;

// export type NormalizedProps = Partial<GroupProps & DndProviderProps> & {
//   className: string;
//   style: CSSProperties;
//   tooltip?: string;
// };

// export type NormalizedComponent = {
//   id: string;
//   type: NormalizedType;
//   sectionId: SectionId;
//   props: NormalizedProps;
// };

// export type NormalizedType =
//   | "text"
//   | `heading-${number}`
//   | "group"
//   | "divider"
//   | "image"
//   | "icon-group"
//   | "entries"
//   | "context"
//   | "contact"
//   | "experience"
//   | "education"
//   | "skills"
//   | "languages";
