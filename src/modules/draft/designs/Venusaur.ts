import { v4 as uuidv4 } from "uuid";

import type { Design, RawDraftComponent } from "../types";
import { toDraftComponents } from "../utils";

const VenusaurId = uuidv4();

const left: RawDraftComponent[] = [
  {
    type: "image",
    id: "user-image",
  },
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
    props: {
      value: "General",
    },
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
      value: "https://www.linkedin.com/in/alexander-ivanov-123456789/",
      label: "LinkedIn",
    },
  },
  {
    type: "group",
    id: "github",
    props: {
      value: "https://www.linkedin.com/in/alexander-ivanov-123456789/",
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

const right: RawDraftComponent[] = [
  {
    type: "heading-1",
    id: "user-name",
    props: {
      value: "Alexander Ivanov",
      label: "Name",
    },
  },
  {
    type: "heading-3",
    id: "job-title",
    props: {
      value: "Frontend developer",
      label: "Job title",
      className: "italic mt-2",
    },
  },
  {
    type: "heading-2",
    id: "employment-history-title",
    props: {
      value: "Experience",
    },
  },
  {
    type: "divider",
    id: "experience-divider",
  },
  {
    type: "timeline",
    id: "timeline",
  },
];

export const Venusaur: Design = {
  id: VenusaurId,
  name: "Venusaur",
  a4: "grid grid-cols-[300px_1fr] bg-white [&_.group]:mb-2",
  sections: {
    left: {
      id: "left",
      order: 0,
      components: toDraftComponents(left, "left"),
      className:
        "flex h-full flex-col items-center bg-[#323B4C] px-5 py-7 clr-white [&_.image]:mx-auto",
    },
    right: {
      id: "right",
      order: 1,
      components: toDraftComponents(right, "right"),
      className:
        "bg-white px-[2rem] py-[3rem] clr-black [&_.heading-1]:text-[#323B4C]",
    },
  },
  components: {
    "heading-1": {
      className: "text-[50px] font-bold leading-[120%]",
    },
    "heading-2": {
      className: "text-[2rem] tracking-[-0.029375rem] font-bold mt-4",
    },
    "heading-3": {
      className: "text-[1rem]",
    },
    text: {},
    group: {
      className: "grid grid-cols-[90px,160px] gap-2",
    },
    timeline: {
      storyType: 1,
      jobDescription: "",
      jobTitle: "",
      vacancyId: "",
    },
    divider: {
      className: "border-current border-solid border-b-[2px] mb-2",
    },
    image: {
      height: 150,
      width: 150,
    },
  },
  font: "Inter",
  image: "/venusaur.png",
  pokemonImage: "/venusaur-pokemon.png",
};
