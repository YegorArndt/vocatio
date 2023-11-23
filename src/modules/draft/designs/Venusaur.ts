import { v4 as uuidv4 } from "uuid";
import type { RawComponent } from "../types/components";
import type { RawDesign } from "../types/design";

const VenusaurId = uuidv4();

const topLeft: RawComponent[] = [
  {
    type: "image",
    id: "user-image",
  },
];

const topRight: RawComponent[] = [
  {
    type: "heading-1",
    id: "user-name",
    props: {
      className: "text-[#323B4C]",
    },
  },
  {
    type: "heading-2",
    id: "job-title",
  },
  {
    type: "text",
    id: "objective",
  },
];

const left: RawComponent[] = [
  {
    type: "heading-2",
    id: "general-title",
    props: {
      value: "General",
    },
  },
  {
    type: "divider",
    id: "general-divider",
  },
  {
    type: "group",
    id: "experience",
    props: {
      value: "3 years",
      label: "Experience",
    },
  },
  {
    type: "group",
    id: "country",
    props: {
      value: "USA",
      label: "Country",
    },
  },
  {
    type: "heading-2",
    id: "contact-title",
    props: {
      value: "Contact",
    },
  },
  {
    type: "divider",
    id: "contact-divider",
    props: {
      value: "General",
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
    type: "divider",
    id: "education-divider",
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
    type: "divider",
    id: "skills-divider",
  },
  {
    type: "text",
    id: "skills-list",
    props: {
      value: "React, Node.js, TypeScript, GraphQL, MongoDB, PostgreSQL",
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
    type: "divider",
    id: "languages-divider",
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

const right: RawComponent[] = [
  {
    type: "heading-2",
    id: "experience-title-title",
    props: {
      value: "Experience",
    },
  },
  {
    type: "divider",
    id: "experience-divider",
  },
  {
    type: "decorated-timeline",
    id: "user-stories",
  },
];

//842

export const Venusaur: RawDesign = {
  id: VenusaurId,
  name: "Venusaur",
  a4: `grid-cols-[300px_1fr] [&>*]:px-5 [&_.divider]:mb-3 [&_.text]:leading-[170%] [&_.date]:relative [&_.story]:relative`,
  sections: {
    "top-left": {
      id: "top-left",
      order: 0,
      components: topLeft,
      className:
        "top-left [&>*:first-child]:my-[2rem] bg-[#323B4C] text-[#fff] [&_.image]:m-auto",
    },
    "top-right": {
      id: "top-right",
      order: 1,
      components: topRight,
      className:
        "top-right [&>*:first-child]:mt-[2rem] [&>*:nth-child(even)]:mb-[1rem] [&>*:nth-child(even)]:mt-1 [&>*:last-child]:mb-[2rem] bg-[#fff] text-[#737373] [&_.heading-2]:text-[1.5rem] [&_.heading-2]:tracking-wider [&_.heading-2]:text-[#323B4C] [&_.heading-2]:font-light [&>*]:max-w-[450px]",
    },
    left: {
      id: "left",
      order: 3,
      components: left,
      className:
        "left flex flex-col items-center bg-[#323B4C] text-[#fff] [&_.image]:mx-auto [&_div:not(:first-child)>.heading-2]:mt-3 [&_.group]:mb-2 [&_.icon-group]:mb-2 [&_.text]:mb-1 [&_.text]:text-[14px]",
    },
    right: {
      id: "right",
      order: 4,
      components: right,
      className:
        "right relative bg-white clr-black [&_.heading-1]:text-[#323B4C] [&_.heading-2]:text-[#323B4C] !pr-2 [&_div:not(:first-child)>.heading-2]:pt-3 [&_.date]:text-[.9rem]",
    },
  },
  intrinsic: {
    "heading-1": {
      className: "text-[50px] leading-[120%]",
    },
    "heading-2": {
      className: "text-[2rem] tracking-[-0.029375rem] font-bold",
    },
    text: {
      className: "text-[.8rem]",
    },
    group: {
      className: "grid grid-cols-[90px,160px] gap-2",
    },
    "icon-group": {
      className: "grid items-center grid-cols-[30px_1fr] gap-3",
      iconClassName: "text-[#fff]",
      width: 30,
      height: 30,
    },
    divider: {
      className: "border-current border-solid border-b-[2px]",
    },
    image: {
      height: 210,
      width: 210,
    },
  },
  font: "Inter",
  image: "/venusaur.png",
  pokemonImage: "/venusaur-pokemon.png",
};
