import { v4 as uuidv4 } from "uuid";

import type { RawComponent } from "../types/components";
import type { RawDesign } from "../types/design";

const NidoqueenId = uuidv4();

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
      className: "text-[50px] font-bold text-[#27384B] uppercase",
      classNameLast: "ml-[2rem]",
    },
  },
  {
    type: "heading-2",
    id: "job-title",
    props: {
      value: "Software Engineer",
      className: "text-center uppercase",
    },
  },
];

const left: RawComponent[] = [
  {
    type: "heading-2",
    id: "about-me-title",
    props: { value: "About Me", className: "text-center w-[230px]" },
  },
  {
    type: "text",
    id: "objective",
    props: {
      value:
        "I am a frontend developer with 3 years of experience. I am looking for a job in a company with a friendly team and interesting projects.",
      className: "text-center px-5 !mb-4 w-[230px]",
    },
  },
  {
    type: "icon-group",
    id: "phone",
    props: {
      img: "phone",
      value: "+7 (999) 999-99-99",
    },
  },
  {
    type: "text",
    id: "email",
  },
  {
    type: "text",
    id: "address",
    props: {
      value: "Moscow, Russia",
    },
  },
  {
    type: "heading-4",
    id: "languages-title",
    props: {
      value: "Languages",
    },
  },
  {
    type: "text",
    id: "english-title",
    modifierIds: ["english-level"],
  },
  {
    type: "text",
    id: "german-title",
    modifierIds: ["german-level"],
  },
  {
    type: "heading-4",
    id: "expertise-title",
    props: {
      value: "Expertise",
    },
  },
  {
    type: "text",
    id: "skill 2",
    props: {
      value: "• first skill",
    },
  },
  {
    type: "text",
    id: "skill 3",
    props: {
      value: "• second skill",
    },
  },
  {
    type: "text",
    id: "skill 4",
    props: {
      value: "• third skill",
    },
  },
  {
    type: "text",
    id: "skill 5",
    props: {
      value: "• fourth skill",
    },
  },
  {
    type: "heading-4",
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
];

const right: RawComponent[] = [
  {
    type: "heading-4",
    id: "nidoqueen-experience-title",
    props: {
      value: "Experience",
    },
  },
  { type: "decorated-timeline", id: "user-stories" },
];

const blueSquare =
  "before:content-[''] before:z-0 before:absolute before:top-0 before:left-0 before:w-[12rem] before:h-[12rem] before:bg-[#26374C]";

const dashedCircle = `after:absolute after:-top-[1rem] after:-right-[5rem] after:w-[12rem] after:h-[12rem] after:border-[2px] after:border-dashed after:border-[#26374C] after:rounded-full after:dashed-bg`;

const leftImage =
  "mx-auto border-solid border-[3px] border-black mb-3 outline-4 outline-white"
    .split(" ")
    .map((c) => "[&_.image]:" + c)
    .join(" ");

const leftHeading4 =
  "[&_.heading-4]:w-[120%] [&_.heading-4]:my-4 [&_.heading-4]:max-w-[20rem]";

export const Nidoqueen: RawDesign = {
  id: NidoqueenId,
  name: "Nidoqueen",
  a4: `[&>*]:px-[2rem] bg-white clr-black relative`,
  sections: {
    "top-left": {
      id: "top-left",
      order: 0,
      components: topLeft,
      className: `top-left ${blueSquare} relative [&>*:first-child]:mt-[3rem] [&>*]:ml-[1rem] [&_.image]:outline-black [&_.image]:outline-4 [&_.image]:border-solid [&_.image]:border-[3px] [&_.image]:border-black`,
    },
    "top-right": {
      id: "top-right",
      order: 1,
      components: topRight,
      className: `top-right relative ${dashedCircle} overflow-hidden -ml-[5rem] z-10 [&>*:first-child]:mt-[3rem] [&>*:nth-child(even)]:-ml-[3rem] [&_.text]:w-full [&_.text]:!text-left`,
    },
    left: {
      id: "left",
      order: 3,
      components: left,
      className: `left [&>*:first-child]:mt-[1rem] flex items-center flex-col [&_.heading-2]:mt-5 [&_.heading-1]:text-[30px] [&_.heading-1]:text-black [&_.text]:my-1 ${leftImage} [&>*]:z-1 relative ${leftHeading4} [&_.text]:max-w-[300px] [&_.group]:max-w-[300px]`,
    },
    right: {
      id: "right",
      order: 4,
      components: right,
      className: "right flex flex-col [&>*:first-child]:mt-[1rem]",
    },
  },
  intrinsic: {
    "heading-1": {
      className: "text-[50px] font-bold text-[#27384B]",
    },
    "heading-2": {
      className: "text-[20px]",
    },
    "heading-3": {
      className: "text-[1rem]",
    },
    "heading-4": {
      className:
        "text-[1rem] py-[8px] w-full bg-[#27384B] text-white flex-center uppercase rounded-md box-border my-4",
    },
    text: {},
    group: {
      className: "grid grid-cols-[100px,160px] gap-2",
    },
    image: {
      height: 220,
      width: 220,
    },
  },
  font: "Inter",
  image: "/nidoqueen.png",
  pokemonImage: "/nidoqueen-pokemon.png",
};
