import { v4 as uuidv4 } from "uuid";
import type { RawComponent } from "../types/components";
import type { RawDesign } from "../types/design";

const RaichuId = uuidv4();

const topLeft: RawComponent[] = [
  {
    type: "image",
    id: "user-image",
  },
];

const topRight: RawComponent[] = [
  {
    type: "name",
    id: "user-name",
    props: {
      className: "text-[#333132] text-[50px]",
      classNameFirst: "font-bold text-[60px]",
    },
  },
  {
    type: "heading-4",
    id: "job-title",
  },
];

const left: RawComponent[] = [
  {
    type: "heading-2",
    id: "raichu-contact-title",
    props: {
      value: "Contact me",
    },
  },
  {
    type: "icon-group",
    id: "email",
    props: {
      label: "Email",
      img: "email",
    },
  },
  {
    type: "icon-group",
    id: "linkedin",
    props: {
      value: "your-linkedin",
      label: "LinkedIn",
      img: "linkedin",
    },
  },
  {
    type: "icon-group",
    id: "github",
    props: {
      value: "your-github",
      label: "Github",
      img: "github",
    },
  },
  {
    type: "icon-group",
    id: "address",
    props: {
      value: "Baker Street, 221B",
      label: "Address",
      img: "location",
    },
  },
  {
    type: "heading-2",
    id: "education-title",
    props: {
      value: "Education",
    },
  },
  {
    type: "text",
    id: "education-duration",
    props: {
      value: "2016-2020",
      label: "Duration",
    },
  },
  {
    type: "text",
    id: "education-degree",
    props: {
      value: "Master degree",
      label: "Degree",
    },
  },
  {
    type: "text",
    id: "education-university",
    props: {
      value: "MSU, Computer Science",
      label: "University",
    },
  },
  {
    type: "heading-2",
    id: "skills-title",
    props: {
      value: "Skills",
    },
  },
  {
    type: "list",
    id: "skills-list",
    props: {
      value:
        "React, Node.js, TypeScript, GraphQL, MongoDB, PostgreSQL, Node.js, TypeScript, GraphQL, MongoDB, PostgreSQL",
      label: "My skills",
    },
  },
  {
    type: "heading-2",
    id: "languages-title",
    props: {
      value: "Languages",
    },
  },
  {
    type: "group",
    id: "english-level",
    props: {
      value: "C1",
      label: "English",
    },
  },
  {
    type: "group",
    id: "russian-level",
    props: {
      value: "Native",
      label: "Russian",
    },
  },
];

// HEY! after:content-[''] after:block after:h-[1px] after:w-full after:bg-[#333132] after:mt-3

const right: RawComponent[] = [
  {
    type: "heading-3",
    id: "experience-title-title",
    props: {
      value: "Work experience",
    },
  },
  {
    type: "decorated-timeline",
    id: "user-stories",
  },
];

export const Raichu: RawDesign = {
  id: RaichuId,
  name: "Raichu",
  a4: `grid-cols-[300px_1fr]`,
  sections: {
    "top-left": {
      id: "top-left",
      order: 0,
      components: topLeft,
      className:
        "top-left px-5 [&>*:first-child]:mt-[2rem] flex flex-col items-center bg-[#F4F4F4] [&_.image]:mx-auto [&_div:not(:first-child)>.heading-2]:mt-3 [&_.group]:mb-2 [&_.icon-group]:mb-2 [&_.text]:mb-1 [&_.text]:text-[14px] [&>*:last-child]:mb-[1.5rem]",
    },
    "top-right": {
      id: "top-right",
      order: 1,
      components: topRight,
      className:
        "top-right px-5 [&>*:first-child]:mt-[2rem] [&>*:nth-child(even)]:mb-[0.5rem] [&>*:nth-child(even)]:mt-1 [&>*:last-child]:mb-[1rem] bg-[#fff] text-[#737373] [&_.heading-2]:text-[1.5rem] [&>*]:max-w-[450px]",
    },
    left: {
      id: "left",
      order: 3,
      components: left,
      className:
        "left bg-[#F4F4F4] px-5 [&_.heading-2]:mb-3 text-[#333132] flex flex-col items-center bg-[#323B4C] [&_.image]:mx-auto [&_div:not(:first-child)>.heading-2]:my-3 [&_.group]:mb-2 [&_.icon-group]:mb-2 [&_.text]:mb-1 [&_.text]:text-[14px] [&_.list]:my-2",
    },
    right: {
      id: "right",
      order: 4,
      components: right,
      className:
        "right relative bg-white text-[#333132] pl-5 [&>*]:pr-3 [&_.heading-1]:text-[#323B4C] [&_div:not(:first-child)>.heading-3]:mt-3 [&_.heading-3]:mb-3",
    },
  },
  intrinsic: {
    "heading-1": {
      className: "text-[#333132] text-[50px]",
    },
    "heading-2": {
      className:
        "text-[1.5rem] py-1 tracking-wider text-[#fff] font-bold  bg-[#333132] text-center rounded-[1.3rem] uppercase",
    },
    "heading-3": {
      className:
        "text-[1.5rem] tracking-wider font-bold uppercase relative overflow-hidden after:content-[''] after:absolute after:top-[2px] after:h-[2px] after:w-full after:bg-[#333132] after:ml-3 after:mt-3",
    },
    "heading-4": {
      className: "text-[#333132] text-[1.5rem] tracking-wider",
    },
    text: {
      className: "text-[.8rem]",
    },
    group: {
      className: "grid grid-cols-[90px,160px] gap-2",
    },
    list: {},
    "icon-group": {
      height: 20,
      width: 20,
    },
    image: {
      height: 210,
      width: 210,
    },
  },
  font: "Inter",
  image: "/raichu.png",
  pokemonImage: "/raichu-pokemon.png",
};
