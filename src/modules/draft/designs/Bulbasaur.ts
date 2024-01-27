import { v4 as uuidv4 } from "uuid";
import {
  bigEntry,
  entry,
  extractYear,
  jobTitle,
  userImage,
  userName,
} from "./utils";
import type { RawComponent, RawDesign } from "../types/raw";

const left: RawComponent[] = [
  userImage({
    height: 180,
    width: 180,
    className: "-ml-[15px] mb-[30px] rounded-full",
  }),
  userName({}),
  jobTitle({ props: { className: "!mt-[10px] !font-thin" } }),
  {
    type: "divider",
    id: "divider-1",
    props: () => ({ className: "divider-1 mt-[20px]" }),
  },
  entry({ id: "contact" }),
  entry({ id: "languages" }),
  bigEntry({
    id: "education",
    order: ["place", "description"],
    place: (entry) => ({
      smallText: `Completed in ${extractYear(entry.period)}.\n${entry.title}.`,
      smallTextClassName: "italic font-semibold",
      className: "text-[14px] grid grid-cols-[50px,1fr]",
      imageProps: { height: 50, width: 50, className: "rounded-full" },
    }),
  }),
];

const right: RawComponent[] = [
  bigEntry({
    id: "experience",
    order: ["place", "title", "description"],
    place: (entry) => ({
      value: `${entry.place} | ${entry.period}`,
      className:
        "!text-[14px] uppercase font-bold grid-cols-[40px,1fr] grid items-center",
      // imageProps: { height: 40, width: 40, className: "rounded-full" },
      smallText: null,
    }),
    title: () => ({
      className: "text-[#9E9E9E] text-[14px]",
    }),
    sectionClassName: "flex flex-col gap-4",
    entryClassName: "flex flex-col gap-2",
    headingGrade: 3,
    headingValue: "Work Experience",
  }),
];

const BulbasaurId = uuidv4();

const contact = "[&_.contact]:flex [&_.contact]:flex-col [&_.contact]:gap-2";
const languages =
  "[&_.languages]:flex [&_.languages]:flex-col [&_.languages]:gap-2";

export const Bulbasaur: RawDesign = {
  id: BulbasaurId,
  name: "Bulbasaur",
  a4: `grid-cols-[280px_1fr] two-cols ${contact} ${languages} [&_.experience]:text-[12px]`,
  sections: {
    left: {
      id: "left",
      components: left,
      className:
        "pt-[50px] bg-[#434C5B] px-[30px] [&_.heading-2]:mb-[20px] [&_.heading-2]:mt-[30px]",
    },
    right: {
      id: "right",
      components: right,
      className: "pt-[50px] bg-[#fff] text-[#000] px-[40px]",
    },
  },
  intrinsic: {
    "heading-1": {
      className: "text-[#fceece] uppercase text-[30px]",
    },
    "heading-2": {
      className: "text-[#eaefee] text-[15px] uppercase font-semibold",
    },
    "heading-3": {
      className:
        "text-[#3C363E] text-[15px] uppercase font-bold bg-[#FBEECD] p-2",
    },
    group: {
      className: "grid grid-cols-[1fr,2fr] gap-3",
    },
    "icon-group": {
      className: "grid grid-cols-[15px,1fr] gap-3",
      imageProps: { height: 15, width: 15 },
    },
    divider: {
      className: "h-[3px] w-full bg-[#eaefee]",
    },
  },
  image: "bulbasaur.png",
  pokemonImage: "bulbasaur-pokemon.png",
  font: "Arial",
};
