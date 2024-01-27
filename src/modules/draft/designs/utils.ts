//@ts-nocheck

import { startCase } from "lodash-es";
import type { CSSProperties } from "react";

import type {
  NormalizedComponent,
  NormalizedProps,
  NormalizedType,
} from "../types/components";
import { cn } from "~/utils";
import type { RawComponent } from "../types/raw";
import { EducationEntry, ExperienceEntry } from "@prisma/client";
import { typedKeys } from "../utils/common";
import { icons } from "~/constants";
import { GroupProps } from "~/modules/draft/intrinsic/Group";

const iconNames = typedKeys(icons);

const defaultIcon = (entryName: string) =>
  iconNames.find((i) => i.includes(entryName.toLowerCase()));

type UtilityComponentProps =
  | ({
      label?: string;
      value?: string;
      type?: NormalizedType;
      props?: Omit<NormalizedProps, "style">;
      height?: number;
      width?: number;
      className?: string;
      style?: CSSProperties;
    } & Partial<GroupProps>)
  | undefined;

export const userImage = (pps?: UtilityComponentProps): RawComponent => {
  const {
    height = 200,
    width = 200,
    className = "rounded-full",
    props,
  } = pps || {};

  return {
    type: "image",
    id: "image",
    props: (data) => ({
      src: data.image,
      height,
      width,
      className,
      ...props,
    }),
  };
};

export const userName = (pps: UtilityComponentProps): RawComponent => {
  const { label = "Name", type = "heading-1", className, props } = pps || {};

  return {
    type,
    id: "name",
    props: (data) => ({
      label,
      value: data.name,
      tooltip: "name",
      className,
      ...props,
    }),
  };
};

export const professionalSummary = (
  pps?: UtilityComponentProps
): RawComponent => {
  const { type = "text", props } = pps || {};

  return {
    type,
    id: "professionalSummary",
    props: (data) => ({
      value: data.professionalSummary,
      tooltip: "Professional Summary",
      label: "Professional Summary",
      ...props,
    }),
  };
};

export const heading = (
  pps: UtilityComponentProps & { grade: number }
): RawComponent => {
  const { value, grade = 2, props } = pps || {};

  return {
    type: `heading-${grade}`,
    id: `heading-for-${value}`,
    sectionId: "left",
    props: {
      value: value,
      // @ts-ignore
      className: "",
      // @ts-ignore
      style: {},
      tooltip: value,
      ...props,
    },
  };
};

export const jobTitle = (pps?: UtilityComponentProps): RawComponent => {
  const { type = "heading-2", props } = pps || {};

  return {
    type,
    id: "jobTitle",
    props: (data) => ({
      value: data.jobTitle,
      tooltip: "Job Title",
      label: "Job Title",
      ...props,
    }),
  };
};

type ContextProps = {
  id: "contact" | "languages" | "skills";
  headingValue?: string;
  headingClassName?: string;
  headingGrade?: number;
  componentType?: NormalizedType;
};

const getType = (entry: ExperienceEntry | EducationEntry) => {
  if (entry.image) return "icon-group";
  if (defaultIcon(entry.name)) return "icon-group";
  if (entry.name) return "group";

  return "text";
};

export const entry = (pps: ContextProps): RawComponent => {
  const {
    id,
    headingValue = startCase(id),
    componentType,
    headingClassName,
    headingGrade,
  } = pps;

  return {
    type: "context",
    id,
    props: (data) => {
      const components = data[id].map((entry) => {
        return {
          type: componentType ?? getType(entry),
          id: entry.id,
          sectionId: id,
          props: {
            image: entry.image ?? defaultIcon(entry.name) ?? "diamond",
            tooltip: entry.name,
            label: entry.name,
            value: entry.value,
          },
        };
      }) as NormalizedComponent[];

      return {
        sections: {
          contact: {
            id,
            components: [
              heading({
                value: headingValue,
                className: headingClassName,
                grade: headingGrade,
              }),
              ...components,
            ],
          },
        },
        tooltip: `${headingValue} Section`,
        className: id,
      };
    },
  };
};

type BigEntryProps = {
  id: "experience" | "education";
  headingValue?: string;
  headingGrade?: number;
  order: ("place" | "title" | "description" | "skills" | "period")[];
  sectionClassName?: string;
  title?: (e: EducationEntry | ExperienceEntry) => UtilityComponentProps;
  period?: (e: EducationEntry | ExperienceEntry) => UtilityComponentProps;
  place?: (e: EducationEntry | ExperienceEntry) => UtilityComponentProps;
  description?: (e: EducationEntry | ExperienceEntry) => UtilityComponentProps;
  skills?: (e: EducationEntry | ExperienceEntry) => UtilityComponentProps;
  entryClassName?: string;
  decorated?: boolean;
};

export const bigEntry = (pps: BigEntryProps): RawComponent => {
  const {
    id,
    headingValue = startCase(id),
    headingGrade,
    order,
    sectionClassName,
    entryClassName,
    decorated,
    title,
    period,
    place,
    description,
    skills,
  } = pps;

  return {
    type: "context",
    id,
    props: (data) => {
      const components = data[id].map((entry) => {
        return {
          type: "entries",
          id: entry.id,
          sectionId: id,
          props: {
            className: entryClassName,
            style: {},
            tooltip: `${headingValue} Entry`,
            sections: {
              [entry.id]: {
                id: entry.id,
                components: [
                  {
                    type: period?.(entry)?.type || "text",
                    id: `period-${entry.id}`,
                    sectionId: entry.id,
                    props: {
                      label: "Period",
                      value: entry.period,
                      tooltip: "Period",
                      ...(period && period(entry)),
                    },
                  },
                  {
                    type: title?.(entry)?.type || "text",
                    id: `title-${entry.id}`,
                    sectionId: entry.id,
                    props: {
                      label: "Title",
                      value: entry.title,
                      tooltip: "Job title",
                      ...(title && title(entry)),
                    },
                  },
                  {
                    type:
                      place?.(entry)?.type ||
                      (entry.image ? "icon-group" : "text"),
                    id: `place-${entry.id}`,
                    sectionId: entry.id,
                    props: {
                      imageProps: id.includes("education")
                        ? { height: 30, width: 30 }
                        : { height: 40, width: 40 },
                      value: entry.place,
                      label: "Place",
                      summary: entry.descriptionSummary,
                      image: entry.image || "diamond",
                      smallText: entry.period,
                      smallTextClassName: "font-thin",
                      className: cn("font-bold text-[16px] grid ", {
                        "grid-cols-[40px,1fr]": id.includes("experience"),
                        "grid-cols-[25px,1fr]": id.includes("education"),
                      }),
                      style: {},
                      tooltip: `${headingValue} Image & Name`,
                      ...(place && place(entry)),
                    },
                  },
                  {
                    type: description?.(entry)?.type || "text",
                    id: `description-${entry.id}`,
                    sectionId: entry.id,
                    props: {
                      value: entry.description,
                      summary: entry.descriptionSummary,
                      tooltip: "Description",
                      style: {},
                      ...(description && description(entry)),
                    },
                  },
                  {
                    type: skills?.(entry)?.type || "icon-group",
                    ...(skills && { type: skills(entry)?.type }),
                    id: `skills-${entry.id}`,
                    sectionId: entry.id,
                    props: {
                      imageProps: { height: 20, width: 20 },
                      className:
                        "font-bold text-[14px] grid grid-cols-[20px,1fr] items-center mt-[8px]",
                      value: "Skills proven during tenure",
                      label: "Skills",
                      image: "diamond",
                      smallText: entry?.skills?.join(", "),
                      smallTextClassName: "font-thin",
                      tooltip: "Skills",
                      style: {},
                      ...(skills && skills(entry)),
                    },
                  },
                ]
                  /**
                   * Rearrange the components based on the order array.
                   */
                  .map((_, i, arr) => arr.find((c) => c.id.includes(order[i])))
                  .filter(Boolean) as NormalizedComponent[],
              },
            },
          },
        };
      }) as NormalizedComponent[];

      return {
        decorated,
        sections: {
          [id]: {
            id,
            components: [
              heading({ value: headingValue, grade: headingGrade }),
              ...components,
            ],
          },
        },
        tooltip: `${headingValue} Section`,
        className: `${id} ${sectionClassName}`,
      };
    },
  };
};

export const extractYear = (inputString: string) => {
  const regex = /\b\d{4}\b/g;
  const matches = inputString.match(regex);

  if (matches && matches.length > 0) {
    // Return the last 4-digit number found
    return matches[matches.length - 1];
  }

  // If no 4-digit number is found, you can return null or handle it as needed
  return null;
};
