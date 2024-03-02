// @ts-nocheck

import { GroupProps } from "../base-components/Group";
import { BaseComponentType, HydratableComponent, SectionName } from "../types";
import { ExperienceEntry, EducationEntry, ContactEntry } from "@prisma/client";
import { GeneratedData } from "~/modules/init-gen/types";
import { iconsMap } from "~/modules/icons-map";
import { isUrlPermissive } from "../utils";
import { RouterUser } from "~/modules/types";
import { CvSubset } from "~/modules/events/types";

const { log } = console;

/**
 * @returns icon name (exact or) `string` that is then matched by `Group` component.
 */
export const defaultIcon = (
  entry: ExperienceEntry | EducationEntry | ContactEntry
) => {
  const entryName = entry.name;

  let iconName = "star";

  if (entryName) {
    const entryNameLower = entryName.toLowerCase();

    iconsMap.forEach((i) => {
      const isExactMatch = i.exact?.includes(entryNameLower);

      if (isExactMatch) {
        iconName = i.exact!.find((i) => i === entryNameLower)!;
        return;
      }

      const isPartialMatch = i.partial?.some((p) => entryNameLower.includes(p));

      if (isPartialMatch) {
        iconName = i.partial!.find((p) => entryNameLower.includes(p))!;
        return;
      }
    });
  }

  if (isUrlPermissive(entry.value) && iconName === "star") return "link";

  return iconName;
};

export const getType = (
  entry: ExperienceEntry | EducationEntry | ContactEntry
) => {
  // @ts-ignore
  if (entry.image) return "icon-group";
  // @ts-ignore
  if (entry.image === "") return "text";

  // @ts-ignore
  if (defaultIcon(entry)) return "icon-group";

  return "text";
};

export const heading1 = (props: {
  value: string;
  id: string;
  sectionId: SectionName;
}) => {
  const { value, id, sectionId } = props;

  return {
    type: "heading-1",
    id,
    sectionId,
    hydratedProps: {
      value,
      grade: 1,
    },
  } as HydratableComponent;
};

export const userImage = (props: { sectionId: SectionName }) => {
  const { sectionId } = props;

  return {
    type: "userImage",
    id: "userImage",
    sectionId,
  } as HydratableComponent;
};

export const userName = (sectionId?: SectionName = "top-left") =>
  ({
    type: "userName",
    id: "userName",
    sectionId,
  } as HydratableComponent);

export const jobTitle = (sectionId?: SectionName = "top-left") =>
  ({
    type: "jobTitle",
    id: "jobTitle",
    sectionId,
  } as HydratableComponent);

export const professionalSummary = (sectionId?: SectionName = "left") =>
  ({
    type: "professionalSummary",
    id: "professionalSummary",
    sectionId,
  } as HydratableComponent);

export const contact = (
  props?: Partial<{
    type: BaseComponentType;
    sectionId: SectionName;
    groupItemProps: Partial<GroupProps>;
  }>
) => {
  const { type, sectionId, groupItemProps } = props || {};

  return {
    type: "contact",
    id: "contact",
    sectionId: sectionId || "top-left",
    hydratableProps: (draft: GeneratedData) => ({
      sections: {
        contact: {
          components: draft.contact.map((entry) => ({
            id: entry.id,
            sectionId: "contact",
            type: type || getType(entry),
            hydratedProps: {
              image: defaultIcon(entry),
              value: entry.value,
              ...groupItemProps,
            },
          })),
        },
      },
    }),
  } as HydratableComponent;
};

export const languages = (
  props?: Partial<{
    type: BaseComponentType;
    sectionId: SectionName;
    groupItemProps: Partial<GroupProps>;
  }>
) => {
  const { type, sectionId, groupItemProps } = props || {};

  return {
    type: "languages",
    id: "languages",
    sectionId: sectionId || "left",
    hydratableProps: (draft: GeneratedData) => ({
      sections: {
        languages: {
          components: draft.languages.map((entry) => ({
            id: entry.id,
            sectionId: "languages",
            type: type || "group",
            hydratedProps: {
              label: entry.name,
              value: entry.value,
              ...groupItemProps,
            },
          })),
        },
      },
    }),
  } as HydratableComponent;
};

export const skills = (
  props?: Partial<{
    type: BaseComponentType;
    sectionId: SectionName;
    groupItemProps: Partial<GroupProps>;
  }>
) => {
  const { type, sectionId, groupItemProps } = props || {};

  return {
    type: "skills",
    id: "skills",
    sectionId: sectionId || "right",
    hydratableProps: (cv: CvSubset) => ({
      sections: {
        skills: {
          components:
            cv?.skills?.map((entry) => ({
              id: entry.id,
              sectionId: "skills",
              type: type || "text",
              hydratedProps: {
                image: defaultIcon(entry),
                value: entry.name,
                valueProps: { className: "text-[12px]" },
                ...groupItemProps,
              },
            })) || [],
        },
      },
    }),
  } as HydratableComponent;
};

export const experience = (
  props?: Partial<{
    type: BaseComponentType;
    sectionId: SectionName;
    groupItemProps: Partial<GroupProps>;
    components: (
      x: ExperienceEntry,
      arrLength: number
    ) => HydratableComponent[];
  }>
) => {
  const { type, sectionId, groupItemProps, components } = props || {};

  return {
    type: "experience",
    id: "experience",
    sectionId: sectionId || "left",
    hydratableProps: (data) => ({
      sections: {
        experience: {
          components:
            data.experience.map((entry, _, arr) => ({
              type: "experience-entry",
              id: entry.id,
              sectionId: "experience",
              hydratableProps: (generatedEntry) => {
                const en =
                  generatedEntry?.id === entry.id ? generatedEntry : entry;

                return {
                  sections: {
                    [entry.id]: {
                      components: components?.(en, arr.length) || [],
                    },
                  },
                };
              },
            })) || [],
        },
      },
    }),
  } as HydratableComponent;
};

export const education = (
  props?: Partial<{
    type: BaseComponentType;
    sectionId: SectionName;
    groupItemProps: Partial<GroupProps>;
    components: (x: EducationEntry) => HydratableComponent[];
    className?: string;
  }>
) => {
  const { type, sectionId, groupItemProps, components, className } =
    props || {};

  return {
    type: "education",
    id: "education",
    sectionId: sectionId || "left",
    hydratableProps: (user: RouterUser) => ({
      sections: {
        education: {
          className,
          components:
            user.education?.map((entry) => ({
              type: "entry",
              id: entry.id,
              sectionId: "education",
              hydratableProps: () => ({
                sections: {
                  [entry.id]: {
                    components: components?.(entry) || [],
                  },
                },
              }),
            })) || [],
        },
      },
    }),
  } as HydratableComponent;
};
