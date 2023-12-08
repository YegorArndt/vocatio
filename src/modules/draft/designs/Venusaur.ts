import { v4 as uuidv4 } from "uuid";
import type { NormalizedComponent, RawComponent } from "../types/components";
import type { RawDesign } from "../types/design";
import { typedEntries } from "../utils/common";
import { heading } from "./utils";
import { capitalize } from "lodash-es";

const VenusaurId = uuidv4();

const topLeft: RawComponent[] = [
  {
    type: "image",
    id: "image",
    initializer: (data) => ({
      src: data.userImage,
      height: 200,
      width: 200,
      className: "rounded-full",
    }),
  },
  {
    type: "image",
    id: "logo",
    initializer: (data) => ({
      src: data.logo,
      className: "absolute top-[2rem] right-[2rem] opacity-50 -z-1 isolate",
      height: 100,
      width: 100,
    }),
  },
];

const topRight: RawComponent[] = [
  {
    type: "heading-1",
    id: "name",
    props: {
      className: "text-[#323B4C]",
    },
    initializer: (data) => ({ value: data.name }),
  },
  {
    type: "heading-2",
    id: "jobTitle",
    initializer: (data) => ({ value: data.jobTitle }),
  },
  {
    type: "text",
    id: "objective",
    initializer: (data) => ({ value: data.objective }),
  },
];

const left: RawComponent[] = [
  {
    type: "list",
    id: "contact",
    props: {
      className: "flex flex-col gap-3",
    },
    initializer: (data) => {
      const items = typedEntries(data.contact).map(([key, value]) => ({
        type: "icon-group",
        id: key,
        props: {
          image: key,
          text: key === "linkedin" ? data.linkedin : value,
        },
      }));

      return {
        title: heading("Contact"),
        items,
      };
    },
  },
  {
    type: "list",
    id: "education",
    props: {
      className: "flex flex-col gap-3",
    },
    initializer: (data) => {
      const items = data.education.map((entry) => ({
        type: "list",
        id: entry.id,
        props: {
          className: "flex flex-col [&>*:first-child]:mb-[0.5em]",
          items: [
            {
              type: "icon-group",
              id: `place-${entry.id}`,
              props: {
                imageProps: { height: 50, width: 50 },
                text: entry.place,
                label: entry.title,
                image: entry.image,
                smallText: entry.period,
                smallTextClassName: "font-thin",
                className:
                  "font-bold text-[1rem] grid grid-cols-[50px,1fr] gap-2 items-center",
              },
            },
            {
              type: "text",
              id: `description-${entry.id}`,
              props: {
                value: entry.description,
              },
            },
          ],
        },
      }));

      return {
        title: heading("Education"),
        items,
      };
    },
  },
  {
    type: "list",
    id: "languages",
    initializer: (data) => {
      const items = data.languages.map((entry) => ({
        type: "group",
        id: entry.id,
        props: {
          label: entry.name,
          text: capitalize(entry.level),
        },
      }));

      return {
        title: heading("Languages"),
        items,
      };
    },
  },
  {
    type: "list",
    id: "topSkills",
    initializer: (data, prevProps) => {
      const items: NormalizedComponent[] = data.topSkills.map(
        (entry, order) => ({
          type: "text",
          id: entry.id,
          sectionId: "left",
          order,
          props: {
            value: entry.name,
            className: "list-item",
            style: {},
          },
        })
      );

      return {
        className: "grid grid-cols-2 gap-1",
        title: heading("Top skills"),
        items,
        footer: {
          type: "icon-group",
          id: "more-skills",
          sectionId: "left",
          order: items.length,
          props: {
            image: "linkedin",
            smallText: "For more visit my linkedin",
            className: "mt-3",
            text: data.linkedin,
            style: {},
          },
        },
      };
    },
  },
];

const right: RawComponent[] = [
  {
    type: "list",
    id: "employmentHistory",
    initializer: (data) => {
      const items = data.employmentHistory.map((entry) => ({
        type: "list",
        id: entry.id,
        props: {
          hasDot: true,
          className: "flex flex-col gap-2 pb-3",
          items: [
            {
              type: "icon-group",
              id: `place-${entry.id}`,
              props: {
                imageProps: { height: 50, width: 50 },
                text: entry.place,
                label: entry.title,
                image: entry.image,
                smallText: entry.period,
                smallTextClassName: "font-thin",
                className:
                  "font-bold text-[1rem] grid grid-cols-[50px,1fr] gap-2 items-center",
              },
            },
            {
              type: "text",
              id: `description-${entry.id}`,
              props: {
                value: entry.description,
              },
            },
          ],
        },
      }));

      return {
        title: heading("Experience"),
        items,
      };
    },
  },
];

export const Venusaur: RawDesign = {
  id: VenusaurId,
  name: "Venusaur",
  a4: `grid-cols-[300px_1fr] [&>*]:px-5 [& .text]:leading-tight`,
  sections: {
    "top-left": {
      id: "top-left",
      order: 0,
      components: topLeft,
      className:
        "top-left [&>*:first-child]:mt-[2rem] flex flex-col items-center bg-[#323B4C] text-[#fff] [&_.image]:mx-auto [&_div:not(:first-child)>.heading-2]:mt-3 [&_.group]:mb-2 [&_.icon-group]:mb-2 [&_.text]:mb-1 [&_.text]:text-[14px] [&>*:last-child]:mb-[5rem]",
    },
    "top-right": {
      id: "top-right",
      order: 1,
      components: topRight,
      className:
        "top-right [&_.heading-2]:border-none [&>*:first-child]:mt-[2rem] [&>*:nth-child(even)]:mb-[0.5rem] [&>*:nth-child(even)]:mt-1 [&>*:last-child]:mb-[1rem] bg-[#fff] text-[#737373] [&_.heading-2]:text-[1.5rem] [&_.heading-2]:tracking-wider [&_.heading-2]:text-[#323B4C] [&_.heading-2]:font-light [&>*]:max-w-[450px]",
    },
    left: {
      id: "left",
      order: 3,
      components: left,
      className:
        "left flex flex-col [&_section]:mb-[1em] items-center bg-[#323B4C] text-[#fff] [&_.image]:mx-auto [&_div:not(:first-child)>.heading-2]:mt-3 [&_.group]:mb-2",
    },
    right: {
      id: "right",
      order: 4,
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
        "text-[1.8rem] tracking-[-0.029375rem] font-bold border-b-2 border-current pb-1 mb-5",
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
