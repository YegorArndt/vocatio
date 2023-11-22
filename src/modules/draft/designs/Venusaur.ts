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
      className: "text-[#323B4C] first",
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
    type: "group",
    id: "email",
    props: {
      label: "Email",
    },
  },
  {
    type: "group",
    id: "linkedin",
    props: {
      value: "short-url",
      label: "LinkedIn",
    },
  },
  {
    type: "group",
    id: "github",
    props: {
      value: "short-url",
      label: "Github",
    },
  },
  {
    type: "group",
    id: "address",
    props: {
      value: "Baker Street, 221B",
      label: "Address",
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
  a4: `grid-cols-[300px_1fr] [&_.group]:mb-2 [&>*]:px-5 [&_.divider]:mb-3 [&_.story]:text-[#737373] [&_.story]:text-[#737373] [&_.story]:pb-6 [&_.story]:pt-2 [&_.story]:max-w-[420px]  [&_.text]:leading-[170%] [&_.date]:relative [&_.story]:relative [&_.companyName]:relative [&_.jobTitle]:relative`,
  sections: {
    "top-left": {
      id: "top-left",
      order: 0,
      components: topLeft,
      className:
        "top-left bg-[#323B4C] text-[#fff] [&_.image]:m-auto pt-[2rem]",
    },
    "top-right": {
      id: "top-right",
      order: 1,
      components: topRight,
      className:
        "top-right pt-[2rem] bg-[#fff] text-[#000] [&_.heading-2]:text-[1.5rem] [&_.heading-2]:tracking-wider [&_.heading-2]:text-[#323B4C] [&_.heading-2]:mb-3 [&_.heading-2]:font-light !pr-2 [&_.text]:max-w-[450px] overflow-y-visible [&_.text]:pb-3 [&_.text]:text-[#737373]",
    },
    left: {
      id: "left",
      order: 3,
      components: left,
      className:
        "left flex flex-col items-center bg-[#323B4C] text-[#fff] [&_.image]:mx-auto [&_div:not(:first-child)>.heading-2]:pt-3",
    },
    right: {
      id: "right",
      order: 4,
      components: right,
      className:
        "right relative bg-white clr-black [&_.heading-1]:text-[#323B4C] [&_.heading-2]:text-[#323B4C] [&_.heading-3]:text-[#323B4C] !pr-2 [&_div:not(:first-child)>.heading-2]:pt-3 [&_.date]:text-[.9rem] [&_.text]:pl-6 [&_.heading-3]:pl-6",
    },
  },
  intrinsic: {
    "heading-1": {
      className: "text-[50px] leading-[120%]",
    },
    "heading-2": {
      className: "text-[2rem] tracking-[-0.029375rem] font-bold",
    },
    "heading-3": {
      className: "text-[1rem]",
    },
    text: {
      className: "text-[.8rem]",
    },
    group: {
      className: "grid grid-cols-[90px,160px] gap-2",
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
