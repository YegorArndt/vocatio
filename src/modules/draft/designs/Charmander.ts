//@ts-nocheck

import { v4 as uuidv4 } from "uuid";
import type { NormalizedComponent, RawComponent } from "../types/components";
import type { RawDesign } from "../types/design";
import { capitalize, startCase } from "lodash-es";
import { clean, heading } from "./utils";
import { typedEntries } from "../utils/common";
import cn from "classnames";

const CharmanderId = uuidv4();

const topLeft: RawComponent[] = [
  {
    type: "image",
    id: "image",
    props: (data) => ({
      src: data.image,
      height: 230,
      width: 230,
      className: "rounded-full",
    }),
  },
];

const topRight: RawComponent[] = [
  {
    type: "heading-1",
    id: "name",
    props: (data) => ({
      label: "Name",
      value: data.name,
      className: "uppercase",
      tooltip: "name",
    }),
  },
  {
    type: "divider",
    id: "divider",
  },
  {
    type: "heading-2",
    id: "jobTitle",
    props: (data) => ({
      value: data.jobTitle,
      tooltip: "Job Title",
      label: "Job Title",
    }),
  },
];

const left: RawComponent[] = [
  {
    type: "entries",
    id: "professionalSummary",
    props: (data) => {
      const components = [
        heading("Profile info", 3),
        {
          type: "text",
          id: "professional-summary",
          sectionId: "professionalSummary",
          props: {
            value: data.professionalSummary,
            tooltip: "Professional Summary",
          },
        },
      ] as NormalizedComponent[];

      return {
        sections: {
          professionalSummary: {
            id: "professionalSummary",
            components,
          },
        },
        tooltip: "Summary Section",
      };
    },
  },
  {
    type: "entries",
    id: "education",
    props: (data) => {
      const components = data.education.map((entry) => ({
        type: "entries",
        id: entry.id,
        sectionId: "education",
        props: {
          tooltip: "Education Item",
          sections: {
            [entry.id]: {
              id: entry.id,
              components: [
                {
                  type: "text",
                  id: `place-${entry.id}`,
                  sectionId: entry.id,
                  props: {
                    imageProps: {
                      height: 25,
                      width: 25,
                      className: "rounded-full",
                    },
                    value: entry.place,
                    label: "University",
                    image: entry.image,
                    smallText:
                      entry.period + (entry.title ? ` | ${entry.title}` : ""),
                    smallTextClassName: "font-thin",
                    className:
                      "font-bold !text-[14px] grid grid-cols-[25px,1fr] gap-2 items-center",
                  },
                },
                ...(entry.description
                  ? [
                      {
                        type: "text",
                        id: `description-${entry.id}`,
                        sectionId: entry.id,
                        props: {
                          label: "Description",
                          value: entry.description,
                          tooltip: "Description",
                        },
                      },
                    ]
                  : []),
              ],
            },
          },
        },
      })) as NormalizedComponent[];

      return {
        title: heading("Education background", 3),
        sections: {
          education: {
            id: "education",
            components,
          },
        },
        className: "flex flex-col gap-4",
        tooltip: "Education Section",
      };
    },
  },
  {
    type: "entries",
    id: "contact",
    props: (data) => {
      const components = typedEntries(clean(data.contact)).map(
        ([key, value]) => ({
          type: "icon-group",
          id: key as string,
          sectionId: "contact",
          props: {
            image: key,
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            value: key === "linkedin" ? data.contact?.linkedin : value,
            tooltip: startCase(key as string),
            label: startCase(key as string),
          },
        })
      ) as NormalizedComponent[];
      return {
        title: heading("My Contact", 3),
        sections: {
          contact: {
            id: "contact",
            components,
          },
        },
        tooltip: "Contact section",
      };
    },
  },
  {
    type: "entries",
    id: "languages",
    props: (data) => {
      const components: NormalizedComponent[] = data.languages.map(
        (entry, order) => ({
          type: "group",
          id: entry.id,
          sectionId: "languages",
          order,
          props: {
            className: "",
            style: {},
            label: entry.name,
            value: capitalize(entry.level),
            tooltip: entry.name,
          },
        })
      );
      return {
        title: heading("Languages", 3),
        sections: {
          languages: {
            id: "languages",
            components,
          },
        },
        tooltip: "Languages section",
      };
    },
  },
];

const right: RawComponent[] = [
  {
    type: "entries",
    id: "employmentHistory",
    props: (data) => {
      const components = data.employmentHistory.map((entry, index) => {
        return {
          type: "entries",
          id: entry.id,
          sectionId: entry.id,
          props: {
            className: "flex flex-col gap-2",
            style: {},
            tooltip: "Experience Entry",
            sections: {
              [entry.id]: {
                id: entry.id,
                components: [
                  {
                    type: "icon-group",
                    id: `place-${entry.id}`,
                    sectionId: entry.id,
                    props: {
                      imageProps: {
                        height: 30,
                        width: 30,
                        className: "rounded-full",
                      },
                      image: entry.image || "bird",
                      value: `${entry.place} | ${entry.period}`,
                      label: entry.title,
                      className: cn(
                        "font-bold !text-[14px] grid grid-cols-[30px,1fr] items-center"
                      ),
                      tooltip: "Company image & name",
                    },
                  },
                  {
                    type: "text",
                    id: `jobTitle-${entry.id}`,
                    sectionId: entry.id,
                    props: {
                      value: entry.title,
                      label: "Job title",
                      className: cn("font-bold !text-[14px] italic"),
                      tooltip: "Job title",
                    },
                  },
                  {
                    type: "text",
                    id: `description-${entry.id}`,
                    sectionId: entry.id,
                    props: {
                      value: entry.description,
                      summary: entry.descriptionSummary,
                      tooltip: "Description",
                    },
                  },
                ],
              },
            },
          },
        };
      }) as NormalizedComponent[];

      return {
        title: heading("Professional Experience", 3),
        sections: {
          employmentHistory: {
            id: "employmentHistory",
            components,
          },
        },
        tooltip: "Experience Section",
        className: "flex flex-col gap-4",
      };
    },
  },
];

export const Charmander: RawDesign = {
  id: CharmanderId,
  name: "Charmander",
  a4: `grid-cols-[320px_1fr] [&>*]:px-[20px] [& .text]:leading-tight [&_.heading-3]:mb-[20px] [&_.group]:mb-[4px] [&_.icon-group]:mb-[8px] [&_.text]:text-[12px] [&_.icon-group]:text-[12px] [&_.group]:text-[12px]`,
  sections: {
    "top-left": {
      id: "top-left",
      components: topLeft,
      className:
        "top-left [&>*:first-child]:mt-[32px] [&>*:last-child]:mb-[32px] bg-[#252E34] text-[#fff] [&_.image]:m-auto",
    },
    "top-right": {
      id: "top-right",
      components: topRight,
      className:
        "top-right bg-[#252E34] text-[#fff] [&>*:first-child]:mt-[32px] [&>*:last-child]:mb-[32px]",
    },
    left: {
      id: "left",
      components: left,
      className:
        "left flex flex-col items-center bg-[#3F4C5C] text-[#fff] ![&>*:first-child]:mt-[22px] [&_.icon-group]:mt-[8px] [&_.group]:mt-[8px] [&_.group]:grid-cols-[80px,1fr]",
    },
    right: {
      id: "right",
      components: right,
      className:
        "right bg-[#fff] text-[#000] ![&>*:first-child]:mt-[22px] [&_.group]:grid-cols-2",
    },
  },
  intrinsic: {
    "heading-1": {
      className: "text-[50px] leading-[120%]",
    },
    "heading-2": {
      className: "text-[29px] italic tracking-wide font-thin pb-[8px]",
    },
    "heading-3": {
      className:
        "text-[22px] tracking-[-0.039375rem] font-bold border-b-2 border-current pb-[8px] mt-[30px]",
    },
    text: {
      className: "",
    },
    group: {
      className: "grid gap-3",
    },
    "icon-group": {
      className: "grid grid-cols-[20px,1fr] gap-3",
      imageProps: { height: 20, width: 20 },
    },
    divider: {
      className: "border-t-2 border-current my-[16px]",
    },
  },
  image: "charmander.png",
  pokemonImage: "charmander-pokemon.png",
  font: "Arial",
};
