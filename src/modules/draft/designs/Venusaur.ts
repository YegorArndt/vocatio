//@ts-nocheck

import { v4 as uuidv4 } from "uuid";
import type { NormalizedComponent, RawComponent } from "../types/components";
import type { RawDesign } from "../types/design";
import { capitalize, startCase } from "lodash-es";
import { clean, heading } from "./utils";
import { typedEntries } from "../utils/common";
import cn from "classnames";

const VenusaurId = uuidv4();

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
    type: "heading-1",
    id: "name",
    props: (data) => ({
      label: "Name",
      value: data.name,
      className: "text-[#323B4C]",
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
      tooltip: "Summary",
      label: "Summary",
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
            value: key === "linkedin" ? data.contact?.linkedin : value,
            tooltip: startCase(key as string),
            label: startCase(key as string),
          },
        })
      ) as NormalizedComponent[];
      return {
        title: heading("Contact"),
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
                  type: "icon-group",
                  id: `place-${entry.id}`,
                  sectionId: entry.id,
                  props: {
                    imageProps: { height: 25, width: 25 },
                    value: entry.place,
                    label: entry.title,
                    image: entry.image,
                    smallText: entry.period,
                    smallTextClassName: "font-thin",
                    className:
                      "font-bold text-[13px] grid grid-cols-[25px,1fr] gap-2 items-center",
                  },
                },
                {
                  type: "text",
                  id: `description-${entry.id}`,
                  sectionId: entry.id,
                  props: {
                    value: entry.description,
                    tooltip: "Description",
                  },
                },
              ],
            },
          },
        },
      })) as NormalizedComponent[];

      return {
        title: heading("Education"),
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
    type: "context",
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
        title: heading("Languages"),
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
    type: "context",
    id: "employmentHistory",
    props: (data) => {
      const components = data.employmentHistory.map((entry) => {
        return {
          type: "entries",
          id: entry.id,
          sectionId: "employmentHistory",
          props: {
            className: "",
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
                      imageProps: { height: 50, width: 50 },
                      value: entry.place,
                      label: entry.title,
                      summary: entry.descriptionSummary,
                      image: entry.image || "bird",
                      smallText: entry.period,
                      smallTextClassName: "font-thin",
                      className: cn(
                        "font-bold text-[16px] grid grid-cols-[50px,1fr]"
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
                  {
                    type: "icon-group",
                    id: `skills-${entry.id}`,
                    sectionId: entry.id,
                    props: {
                      imageProps: { height: 20, width: 20 },
                      className:
                        "font-bold text-[14px] grid grid-cols-[20px,1fr] items-center mt-[8px]",
                      value: "Skills proven during tenure",
                      label: "Skills",
                      image: "diamond",
                      smallText: entry.skills.join(", "),
                      smallTextClassName: "font-thin",
                      tooltip: "Skills",
                    },
                  },
                ],
              },
            },
          },
        };
      }) as NormalizedComponent[];

      return {
        decorated: true,
        title: heading("Experience"),
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

export const Venusaur: RawDesign = {
  id: VenusaurId,
  name: "Venusaur",
  a4: `grid-cols-[300px_1fr] [&>*]:px-[20px] [& .text]:leading-tight [&_.heading-2]:mb-[20px] [&_.group]:mb-[4px] [&_.icon-group]:mb-[8px]`,
  sections: {
    "top-left": {
      id: "top-left",
      components: topLeft,
      className:
        "top-left [&>*:first-child]:mt-[32px] flex flex-col items-center bg-[#323B4C] text-[#fff] [&_.image]:mx-auto [&_div:not(:first-child)>.heading-2]:mt-[12px] [&_.text]:mb-[4px] [&_.text]:text-[14px] [&>*:last-child]:mb-[48px]",
    },
    "top-right": {
      id: "top-right",
      components: topRight,
      className:
        "top-right [&_.heading-2]:border-none [&>*:first-child]:mt-[32px] [&>*:nth-child(even)]:mb-[8px] [&>*:nth-child(even)]:mt-1 [&>*:last-child]:mb-[16px] bg-[#fff] text-[#737373] [&_.heading-2]:text-[1.5rem] [&_.heading-2]:tracking-wider [&_.heading-2]:text-[#323B4C] [&_.heading-2]:font-light [&>*]:max-w-[450px] [&_.text]:text-[12px]",
    },
    left: {
      id: "left",
      components: left,
      className:
        "left flex flex-col [&_section]:mb-[16px] items-center bg-[#323B4C] text-[#fff] [&_.image]:mx-auto [&_div:not(:first-child)>.heading-2]:mt-3 [&_.group]:mb-[8px] [&_.group]:grid-cols-[100px,1fr]",
    },
    right: {
      id: "right",
      components: right,
      className:
        "right [&_section]:mb-[16px] bg-white text-[#000] [&_.heading-1]:text-[#323B4C] [&_.heading-2]:text-[#323B4C] !pr-2 [&_div:not(:first-child)>.heading-2]:pt-[12px] [&_.text]:text-[12px] [&_.group]:grid-cols-2",
    },
  },
  intrinsic: {
    "heading-1": {
      className: "text-[50px] leading-[120%]",
    },
    "heading-2": {
      className:
        "text-[29px] tracking-[-0.039375rem] font-bold border-b-2 border-current pb-[8px]",
    },
    text: {
      className: "",
    },
    group: {
      className: "grid  gap-3",
    },
    "icon-group": {
      className: "grid grid-cols-[20px,1fr] gap-3",
      imageProps: { height: 20, width: 20 },
    },
  },
  image: "venusaur.png",
  pokemonImage: "venusaur-pokemon.png",
  font: "Arial",
};
