import { v4 as uuidv4 } from "uuid";
import type { RawComponent } from "../types/components";
import type { RawDesign } from "../types/design";

const JigglypuffId = uuidv4();

const topLeft: RawComponent[] = [
  {
    type: "image",
    id: "user-image",
    props: {
      className: "-mb-[8rem] grayscale",
    },
  },
];

const topRight: RawComponent[] = [
  {
    type: "heading-1",
    id: "user-name",
    props: {
      className: "uppercase font-bold",
    },
  },
  {
    type: "heading-2",
    id: "job-title",
  },
];

const left: RawComponent[] = [
  {
    type: "heading-3",
    id: "jigglypuff-contact-title",
    props: {
      value: "My Contact",
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
    type: "heading-3",
    id: "jigglypuff-education-title",
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
    type: "heading-3",
    id: "jigglypuff-skills-title",
    props: {
      value: "Skills",
    },
  },

  {
    type: "list",
    id: "skills-list",
    props: {
      value: "React, Node.js, TypeScript, GraphQL, MongoDB, PostgreSQL",
      label: "My skills",
    },
  },
  {
    type: "heading-3",
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

export const Jigglypuff: RawDesign = {
  id: JigglypuffId,
  name: "Jigglypuff",
  a4: `grid-cols-[330px_1fr]`,
  sections: {
    "top-left": {
      id: "top-left",
      order: 0,
      components: topLeft,
      className:
        "top-left [&>*:first-child]:mt-[2rem] flex flex-col items-center bg-[#8d4b55] text-[#fff] [&_.image]:mx-auto [&_div:not(:first-child)>.heading-2]:mt-3 [&_.group]:mb-2 [&_.icon-group]:mb-2 [&_.text]:mb-1 [&_.text]:text-[14px] [&>*:last-child]:mb-[1.5rem]",
    },
    "top-right": {
      id: "top-right",
      order: 1,
      components: topRight,
      className:
        "top-right [&>*:first-child]:mt-[2rem] bg-[#8d4b55] [&>*:nth-child(even)]:mb-[0.5rem] [&>*:nth-child(even)]:mt-1 [&>*:last-child]:mb-[1rem]  text-[#fff] [&_.heading-2]:text-[1.5rem] [&>*]:max-w-[450px]",
    },
    left: {
      id: "left",
      order: 3,
      components: left,
      className:
        "left bg-[#FFFDFD] [&>*]:pl-[3rem] [&>*:first-child]:mt-[8rem] [&_.heading-2]:mb-3 text-[#333132] flex flex-col items-center bg-[#fff] [&_.image]:mx-auto [&_div:not(:first-child)>.heading-2]:my-3 [&_.group]:mb-2 [&_.icon-group]:mb-2 [&_.text]:mb-1 [&_.text]:text-[14px] [&_.heading-3]:mt-4",
    },
    right: {
      id: "right",
      order: 4,
      components: right,
      className:
        "right [&>*:first-child]:mt-[2rem] bg-[#FFFDFD] pr-8 text-[#333132]",
    },
  },
  intrinsic: {
    "heading-1": {
      className: "text-[50px]",
    },
    "heading-2": {
      className: "text-[2rem] tracking-[-0.029375rem]",
    },
    "heading-3": {
      className:
        "text-[1.3rem] font-bold text-[#942637] after:content-[''] after:block after:h-[2px] after:w-[90px] after:bg-[#942637] after:my-3",
    },
    text: {
      className: "text-[.8rem]",
    },
    list: {},
    group: {
      className: "grid grid-cols-[90px,160px] gap-2",
    },
    "icon-group": {
      height: 20,
      width: 20,
    },
    divider: {
      className:
        "border-current border-solid border-b-[2px] max-w-[90px] text-[#8D4B55] mt-4 mb-3",
    },
    "decorated-timeline": {
      className: "mt-5",
    },
    image: {
      height: 250,
      width: 250,
    },
  },
  font: "Inter",
  image: "/jigglypuff.png",
  pokemonImage: "/jigglypuff-pokemon.png",
};
