//@ts-nocheck

import { v4 as uuidv4 } from "uuid";
import type { NormalizedComponent, RawComponent } from "../types/components";
import type { RawDesign } from "../types/design";
import { capitalize, startCase, take } from "lodash-es";
import { clean, heading } from "./utils";
import { typedEntries } from "../utils/common";
import cn from "classnames";

const RaichuId = uuidv4();

const topLeft: RawComponent[] = [
  {
    type: "image",
    id: "image",
    props: (data) => ({
      src: data.image,
      height: 200,
      width: 200,
      className: "rounded-full",
    }),
  },
];

const topRight: RawComponent[] = [
  {
    type: "text",
    id: "name",
    props: (data) => ({
      label: data.name.split(" ")[0],
      value: data.name,
      className:
        "flex flex-col !text-[50px] !gap-0 leading-[1] first:font-bold",
      tooltip: "name",
    }),
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
  {
    type: "text",
    id: "professionalSummary",
    props: (data) => ({
      value: data.professionalSummary,
      tooltip: "Professional Summary",
      label: "Professional Summary",
    }),
  },
];

const left: RawComponent[] = [
  {
    type: "context",
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
            value:
              key === "linkedin"
                ? `linkedin.com/in/${data.contact?.linkedin}/`
                : value,
            tooltip: startCase(key as string),
            label: startCase(key as string),
          },
        })
      ) as NormalizedComponent[];
      return {
        title: heading("Contact me", 3),
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
    type: "context",
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
                  type: entry.image ? "icon-group" : "text",
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
        title: heading("Education", 3),
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
  {
    type: "entries",
    id: "skills",
    props: (data) => {
      const components: NormalizedComponent[] = take(
        data.topSkills.map((skill) => ({
          type: "text",
          id: skill,
          sectionId: "skills",
          props: {
            className: "",
            style: {},
            label: "Skill",
            value: `• ${skill}`,
            tooltip: skill,
          },
        })),
        5
      );

      return {
        title: heading("Top Skills", 3),
        sections: {
          skills: {
            id: "skills",
            components,
          },
        },
        className: "flex flex-col gap-2",
        tooltip: "Skills section",
      };
    },
  },
];

const right: RawComponent[] = [
  {
    type: "context",
    id: "employmentHistory",
    props: (data) => {
      const components = data.employmentHistory.map((entry, index) => {
        return {
          type: "entries",
          id: entry.id,
          sectionId: entry.id,
          props: {
            tooltip: "Experience Entry",
            sections: {
              [entry.id]: {
                id: entry.id,
                components: [
                  {
                    type: "group",
                    id: `jobTitle-${entry.id}`,
                    sectionId: entry.id,
                    props: {
                      label: entry.title,
                      value: entry.period,
                      className:
                        "flex-between w-full !text-[15px] font-semibold italic text-[#737373]",
                      tooltip: "Job title",
                    },
                  },
                  {
                    type: "icon-group",
                    id: `place-${entry.id}`,
                    sectionId: entry.id,
                    props: {
                      imageProps: {
                        height: 35,
                        width: 35,
                        className: "rounded-full",
                      },
                      image: entry.image || "bird",
                      value: entry.place,
                      label: entry.title,
                      className: cn(
                        "font-bold !text-[16px] grid grid-cols-[35px,1fr] items-center"
                      ),
                      tooltip: "Company image & name",
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
        title: heading("Work Experience", 4),
        sections: {
          employmentHistory: {
            id: "employmentHistory",
            components,
          },
        },
        tooltip: "Experience Section",
        className: "flex flex-col gap-6 [&>*:first-child]:mt-[20px]",
      };
    },
  },
];

export const Raichu: RawDesign = {
  id: RaichuId,
  name: "Raichu",
  a4: `grid-cols-[315px_1fr] [&>*]:px-[20px] [& .text]:leading-tight [&_.heading-3]:mb-[20px] [&_.group]:mb-[4px] [&_.icon-group]:mb-[8px] [&_.text]:text-[12px] [&_.icon-group]:text-[12px] [&_.group]:text-[12px] text-[#313131]`,
  sections: {
    "top-left": {
      id: "top-left",
      components: topLeft,
      className:
        "top-left [&>*:first-child]:mt-[32px] [&>*:last-child]:mb-[32px] bg-[#f5f5f5] [&_.image]:m-auto",
    },
    "top-right": {
      id: "top-right",
      components: topRight,
      className:
        "top-right bg-[#fff] [&>*:first-child]:mt-[32px] [&>*:last-child]:mb-[px] flex-center flex-col gap-3",
    },
    left: {
      id: "left",
      components: left,
      className:
        "left flex flex-col items-center bg-[#f5f5f5] ![&>*:first-child]:mt-[22px] [&_.icon-group]:mt-[8px] [&_.group]:mt-[8px] [&_.group]:grid-cols-[80px,1fr]",
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
      className: "text-[25px] italic tracking-wide font-thin pb-[8px]",
    },
    "heading-3": {
      className:
        "text-[16px] uppercase bg-[#444442] font-bold flex-center text-[#fff] rounded-full mt-[20px] py-[8px] px-[16px] leading-[120%]",
    },
    "heading-4": {
      className:
        "uppercase font-bold text-[#444442] text-[16px] font-bold py-[8px] rounded-full mt-[20px] w-full flex-y gap-1 after:h-[2px] after:bg-[#444442] after:grow leading-[120%] ",
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
  },
  image: "raichu.png",
  pokemonImage: "raichu-pokemon.png",
  font: "Arial",
};
