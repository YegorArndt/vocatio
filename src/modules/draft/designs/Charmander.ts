import { v4 as uuidv4 } from "uuid";
import {
  bigEntry,
  entry,
  extractYear,
  heading,
  jobTitle,
  professionalSummary,
  userImage,
  userName,
} from "./utils";
import { RawComponent, RawDesign } from "../types/raw";

const CharmanderId = uuidv4();

const topLeft: RawComponent[] = [userImage()];

const topRight: RawComponent[] = [
  userName({ className: "uppercase" }),
  {
    type: "divider",
    id: "divider",
  },
  jobTitle(),
];

const left: RawComponent[] = [
  heading({ value: "Profile info", grade: 3 }),
  professionalSummary(),
  bigEntry({
    id: "education",
    headingValue: "Education Background",
    headingGrade: 3,
    order: ["place", "title", "period"],
    place: () => ({
      smallText: null,
    }),
    title: () => ({
      type: "text",
    }),
    period: (entry) => ({
      value: extractYear(entry.period)
        ? `Completed in ${extractYear(entry.period)}`
        : entry.period,
    }),
  }),
  entry({ id: "contact", headingGrade: 3, headingValue: "My Contact" }),
  entry({ id: "languages", headingGrade: 3 }),
];

const right: RawComponent[] = [
  bigEntry({
    id: "experience",
    headingValue: "Professional Experience",
    headingGrade: 3,
    order: ["place", "title", "description"],
    place: (entry) => ({
      smallText: null,
      value: `${entry.place} | ${entry.period}`,
      className: "!text-[14px] font-bold",
    }),
    title: () => ({
      smallText: null,
      className: "!text-[14px] font-bold",
    }),
    entryClassName: "mb-5 flex flex-col gap-2",
  }),
];

export const Charmander: RawDesign = {
  id: CharmanderId,
  name: "Charmander",
  a4: `grid-cols-[320px_1fr] [&>*]:px-[20px] [& .text]:leading-tight [&_.heading-3]:mb-[20px] [&_.group]:mb-[4px] [&_.icon-group]:mb-[8px] [&_.text]:text-[12px] [&_.icon-group]:text-[12px] [&_.group]:text-[12px]`,
  sections: {
    "top-left": {
      id: "top-left",
      components: topLeft,
      className:
        "top-left [&>*:first-child]:mt-[32px] [&>*:last-child]:mb-[32px] bg-[#252E34] text-[#fff] [&_.image]:m-auto",
    },
    "top-right": {
      id: "top-right",
      components: topRight,
      className:
        "top-right bg-[#252E34] text-[#fff] [&>*:first-child]:mt-[32px] [&>*:last-child]:mb-[32px]",
    },
    left: {
      id: "left",
      components: left,
      className:
        "left flex flex-col items-center bg-[#3F4C5C] text-[#fff] ![&>*:first-child]:mt-[22px] [&_.icon-group]:mt-[8px] [&_.group]:mt-[8px] [&_.group]:grid-cols-[80px,1fr] [&_.icon-group]:grid-cols-[20px,1fr]",
    },
    right: {
      id: "right",
      components: right,
      className:
        "right bg-[#fff] text-[#000] ![&>*:first-child]:mt-[22px] [&_.group]:grid-cols-2 [&_.icon-group]:grid-cols-[40px,1fr] [&_.icon-group]:items-center",
    },
  },
  intrinsic: {
    "heading-1": {
      className: "text-[50px] leading-[120%]",
    },
    "heading-2": {
      className: "text-[29px] italic tracking-wide font-thin pb-[8px]",
    },
    "heading-3": {
      className:
        "text-[22px] tracking-[-0.039375rem] font-bold border-b-2 border-current pb-[8px] mt-[30px]",
    },
    text: {
      className: "",
    },
    group: {
      className: "grid gap-3",
    },
    "icon-group": {
      className: "grid grid-cols-[20px,1fr] gap-3",
      imageProps: { height: 20, width: 20 },
    },
    divider: {
      className: "border-t-2 border-current my-[16px]",
    },
  },
  image: "charmander.png",
  pokemonImage: "charmander-pokemon.png",
  font: "Arial",
};
