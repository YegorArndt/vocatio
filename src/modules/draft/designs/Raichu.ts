import { v4 as uuidv4 } from "uuid";

import type { RawComponent, RawDesign } from "../types/raw";
import {
  bigEntry,
  entry,
  jobTitle,
  professionalSummary,
  userImage,
} from "./utils";

const topLeft: RawComponent[] = [userImage()];

const topRight: RawComponent[] = [
  {
    type: "text",
    id: "name",
    props: (data) => ({
      label: data.name.split(" ")[0],
      value: data.name,
      className:
        "flex flex-col !text-[50px] !gap-0 leading-[1] first:font-bold",
      tooltip: "name",
    }),
  },
  jobTitle(),
  professionalSummary(),
];

const left: RawComponent[] = [
  entry({ id: "contact", headingGrade: 3 }),
  bigEntry({
    id: "education",
    headingGrade: 3,
    order: ["place"],
    place: (entry) => ({
      smallText: `${entry.title} | ${entry.period}`,
      imageProps: { height: 30, width: 30 },
      className: "gap-1 text-[16px] font-bold",
    }),
    description: () => ({
      value: "",
    }),
  }),
  entry({ id: "languages", headingGrade: 3, componentType: "group" }),
];

const right: RawComponent[] = [
  bigEntry({
    id: "experience",
    headingGrade: 4,
    order: ["title", "place", "description"],
    title: (entry) => ({
      type: "group",
      label: entry.title,
      value: entry.period,
      className:
        "flex-between w-full !text-[15px] font-semibold italic text-[#737373]",
    }),
    place: () => ({
      smallText: null,
      className: "font-bold !text-[16px] flex-y",
    }),
    entryClassName: "gap-1 flex flex-col",
    sectionClassName: "gap-4 flex flex-col",
    headingValue: "Work Experience",
  }),
];

const RaichuId = uuidv4();

export const Raichu: RawDesign = {
  id: RaichuId,
  name: "Raichu",
  a4: `grid-cols-[315px_1fr] [&>*]:px-[20px] [& .text]:leading-tight [&_.heading-3]:mb-[20px] [&_.group]:mb-[4px] [&_.icon-group]:mb-[8px] [&_.text]:text-[12px] [&_.icon-group]:text-[12px] [&_.group]:text-[12px] text-[#313131]`,
  sections: {
    "top-left": {
      id: "top-left",
      components: topLeft,
      className:
        "top-left [&>*:first-child]:mt-[32px] [&>*:last-child]:mb-[32px] bg-[#f5f5f5] [&_.image]:m-auto",
    },
    "top-right": {
      id: "top-right",
      components: topRight,
      className:
        "top-right bg-[#fff] [&>*:first-child]:mt-[32px] [&>*:last-child]:mb-[px] flex-center flex-col gap-3",
    },
    left: {
      id: "left",
      components: left,
      className:
        "left flex flex-col items-center bg-[#f5f5f5] ![&>*:first-child]:mt-[22px] [&_.icon-group]:mt-[8px] [&_.group]:mt-[8px] [&_.group]:grid-cols-[80px,1fr]",
    },
    right: {
      id: "right",
      components: right,
      className:
        "right bg-[#fff] text-[#000] ![&>*:first-child]:mt-[22px] [&_.group]:grid-cols-2",
    },
  },
  intrinsic: {
    "heading-1": {
      className: "text-[50px] leading-[120%]",
    },
    "heading-2": {
      className: "text-[25px] italic tracking-wide font-thin pb-[8px]",
    },
    "heading-3": {
      className:
        "text-[16px] uppercase bg-[#444442] font-bold flex-center text-[#fff] rounded-full mt-[20px] py-[8px] px-[16px] leading-[120%]",
    },
    "heading-4": {
      className:
        "uppercase font-bold text-[#444442] text-[16px] font-bold py-[8px] rounded-full mt-[20px] w-full flex-y gap-1 after:h-[2px] after:bg-[#444442] after:grow leading-[120%] ",
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
  },
  image: "raichu.png",
  pokemonImage: "raichu-pokemon.png",
  font: "Arial",
};
