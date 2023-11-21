import { v4 as uuidv4 } from "uuid";
import type { RawDesign, RawComponent } from "../types/raw";

const NidoqueenId = uuidv4();

const left: RawComponent[] = [
  {
    type: "image",
    id: "user-image",
  },
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
    type: "text",
    id: "phone",
    props: {
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
    modifierFn: (values, props) => {
      const [englishLevel] = values;
      return {
        value: `• English (${englishLevel})`,
      };
    },
  },
  {
    type: "text",
    id: "german-title",
    modifierIds: ["german-level"],
    modifierFn: (values, props) => {
      const [germanLevel] = values;
      return {
        value: `• German (${germanLevel})`,
      };
    },
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
    type: "heading-1",
    id: "first-name",
    props: {
      className: "uppercase",
    },
    modifierIds: ["user-name"],
    modifierFn: (values) => {
      const [firstName] = values;
      return {
        value: firstName,
      };
    },
  },
  {
    type: "heading-1",
    id: "last-name",
    props: {
      className: "ml-8 uppercase",
    },
    modifierIds: ["user-name"],
    modifierFn: (values) => {
      const [, lastName] = values;
      return {
        value: lastName,
      };
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
  {
    type: "heading-4",
    id: "nidoqueen-experience-title",
    props: {
      value: "Experience",
    },
  },
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
  a4: `flex py-[4rem] px-[2rem] bg-white clr-black relative ${blueSquare} ${dashedCircle}`,
  rawSections: {
    left: {
      id: "left",
      order: 0,
      rawComponents: left,
      className: `flex items-center flex-col [&_.heading-2]:mt-5 [&_.heading-1]:text-[30px] [&_.heading-1]:text-black [&_.text]:my-1 ${leftImage} [&>*]:z-1 relative ${leftHeading4} [&_.text]:max-w-[300px] [&_.group]:max-w-[300px]`,
    },
    right: {
      id: "right",
      order: 1,
      rawComponents: right,
      className:
        "flex flex-col [&_.heading-4]:ml-[5rem] [&_.heading-4]:mt-[3rem]",
    },
  },
  intrinsic: {
    "heading-1": {
      className: "text-[50px] font-bold text-[#27384B] leading-[120%]",
    },
    "heading-2": {
      className: "text-[20px]",
    },
    "heading-3": {
      className: "text-[1rem] mb-[2%]",
    },
    "heading-4": {
      className:
        "text-[1rem] py-[8px] w-full bg-[#27384B] text-white flex-center uppercase rounded-[5px] box-border",
    },
    text: {},
    group: {
      className: "grid grid-cols-[100px,160px] gap-2",
    },
    image: {
      height: 200,
      width: 200,
    },
  },
  font: "Inter",
  image: "/nidoqueen.png",
  pokemonImage: "/nidoqueen-pokemon.png",
};
