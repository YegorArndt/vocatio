import { v4 as uuidv4 } from "uuid";
import type { NormalizedComponent, RawComponent } from "../types/components";
import type { RawDesign } from "../types/design";
import { capitalize } from "lodash-es";
import { heading } from "./utils";
import { typedEntries } from "../utils/common";

const VenusaurId = uuidv4();

const topLeft: RawComponent[] = [
  {
    type: "image",
    id: "image",
    props: (data) => ({
      src: data.userImage,
      height: 200,
      width: 200,
      className: "rounded-full",
    }),
  },
  // {
  //   type: "image",
  //   id: "logo",
  //   props: (data) => ({
  //     src: data.logo,
  //     className:
  //       "absolute top-[2rem] left-[10rem] opacity-50 -z-1 rounded-full",
  //     height: 100,
  //     width: 100,
  //   }),
  // },
];

const topRight: RawComponent[] = [
  {
    type: "heading-1",
    id: "name",
    props: (data) => ({
      value: data.name,
      className: "text-[#323B4C]",
      tooltip: "name",
    }),
  },
  {
    type: "heading-2",
    id: "jobTitle",
    props: (data) => ({ value: data.jobTitle, tooltip: "Job Title" }),
  },
  {
    type: "text",
    id: "objective",
    props: (data) => ({ value: data.objective, tooltip: "Objective" }),
  },
];

const left: RawComponent[] = [
  {
    type: "entries",
    id: "contact",
    props: (data) => {
      const components = typedEntries(data.contact).map(([key, value]) => ({
        type: "icon-group",
        id: key,
        sectionId: "contact",
        props: {
          image: key,
          value: key === "linkedin" ? data.linkedin : value,
          tooltip: key,
        },
      }));
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
    type: "entries",
    id: "education",
    props: (data) => {
      const components = data.education.map((entry) => ({
        type: "entries",
        id: entry.id,
        sectionId: "education",
        props: {
          tooltip: "Education item",
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
                    image: entry.image,
                    smallText: entry.period,
                    smallTextClassName: "font-thin",
                    className:
                      "font-bold text-[1rem] grid grid-cols-[50px,1fr] gap-2 items-center",
                    tooltip: entry.place,
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
      }));

      return {
        title: heading("Education"),
        sections: {
          education: {
            id: "education",
            components,
          },
        },
        className: "flex flex-col gap-4",
        tooltip: "Education section",
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
    type: "entries",
    id: "employmentHistory",
    props: (data) => {
      const components = data.employmentHistory.map((entry) => {
        return {
          type: "entries",
          id: entry.id,
          sectionId: entry.id,
          props: {
            tooltip: "Experience item",
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
                      image: entry.image,
                      smallText: entry.period,
                      smallTextClassName: "font-thin",
                      className:
                        "font-bold text-[1rem] grid grid-cols-[50px,1fr] gap-2 items-center",
                      tooltip: "Company image & name",
                    },
                  },
                  {
                    type: "text",
                    id: `description-${entry.id}`,
                    sectionId: entry.id,
                    props: {
                      value: entry.description,
                      // .replaceAll("·", "\n · "),
                      tooltip: "Description",
                    },
                  },
                ],
              },
            },
          },
        };
      });

      return {
        decorated: true,
        title: heading("Experience"),
        sections: {
          employmentHistory: {
            id: "employmentHistory",
            components,
          },
        },
        tooltip: "Experience section",
      };
    },
  },
];

export const Venusaur: RawDesign = {
  id: VenusaurId,
  name: "Venusaur",
  a4: `grid-cols-[300px_1fr] [&>*]:px-5 [& .text]:leading-tight [&_.heading-2]:mb-5 [&_.group]:mb-1 [&_.icon-group]:mb-2`,
  sections: {
    "top-left": {
      id: "top-left",
      components: topLeft,
      className:
        "top-left [&>*:first-child]:mt-[2rem] flex flex-col items-center bg-[#323B4C] text-[#fff] [&_.image]:mx-auto [&_div:not(:first-child)>.heading-2]:mt-3 [&_.text]:mb-1 [&_.text]:text-[14px] [&>*:last-child]:mb-[3rem]",
    },
    "top-right": {
      id: "top-right",
      components: topRight,
      className:
        "top-right [&_.heading-2]:border-none [&>*:first-child]:mt-[2rem] [&>*:nth-child(even)]:mb-[0.5rem] [&>*:nth-child(even)]:mt-1 [&>*:last-child]:mb-[1rem] bg-[#fff] text-[#737373] [&_.heading-2]:text-[1.5rem] [&_.heading-2]:tracking-wider [&_.heading-2]:text-[#323B4C] [&_.heading-2]:font-light [&>*]:max-w-[450px]",
    },
    left: {
      id: "left",
      components: left,
      className:
        "left flex flex-col [&_section]:mb-[1em] items-center bg-[#323B4C] text-[#fff] [&_.image]:mx-auto [&_div:not(:first-child)>.heading-2]:mt-3 [&_.group]:mb-2",
    },
    right: {
      id: "right",
      components: right,
      className:
        "right [&_section]:mb-[1em] bg-white text-black [&_.heading-1]:text-[#323B4C] [&_.heading-2]:text-[#323B4C] !pr-2 [&_div:not(:first-child)>.heading-2]:pt-3",
    },
  },
  intrinsic: {
    "heading-1": {
      className: "text-[50px] leading-[120%]",
    },
    "heading-2": {
      className:
        "text-[1.8rem] tracking-[-0.029375rem] font-bold border-b-2 border-current pb-2",
    },
    text: {
      className: "text-[0.79rem]",
    },
    group: {
      className: "grid grid-cols-[90px,160px] gap-3",
    },
    "icon-group": {
      className: "grid grid-cols-[20px,1fr] items-center gap-3",
      imageProps: { height: 20, width: 20 },
    },
    image: {
      height: 200,
      width: 200,
    },
  },
  font: "Inter",
  image: "/venusaur.png",
  pokemonImage: "/venusaur-pokemon.png",
};
