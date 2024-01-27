import { v4 as uuidv4 } from "uuid";
import {
  bigEntry,
  entry,
  jobTitle,
  professionalSummary,
  userImage,
  userName,
} from "./utils";
import { RawComponent, RawDesign } from "../types/raw";

const VenusaurId = uuidv4();

const topLeft: RawComponent[] = [userImage()];

const topRight: RawComponent[] = [
  userName({ className: "text-[#323B4C]" }),
  jobTitle(),
  professionalSummary(),
];

const left: RawComponent[] = [
  entry({ id: "contact" }),
  bigEntry({
    id: "education",
    order: ["place", "description"],
    place: () => ({
      className:
        "font-bold text-[13px] grid grid-cols-[25px,1fr] gap-2 items-center",
    }),
    sectionClassName: "flex flex-col",
  }),
  entry({ id: "languages", componentType: "group" }),
];

const right: RawComponent[] = [
  bigEntry({
    id: "experience",
    order: ["place", "description", "skills"],
    place: () => ({
      className: "!text-[16px] font-bold grid-cols-[40px,1fr] grid",
    }),
    sectionClassName: "flex flex-col gap-4",
    entryClassName: "flex flex-col gap-3",
    decorated: true,
  }),
];

export const Venusaur: RawDesign = {
  id: VenusaurId,
  name: "Venusaur",
  a4: `grid-cols-[300px_1fr] [&>*]:px-[20px] [& .text]:leading-tight [&_.group]:mb-[4px] [&_.icon-group]:mb-[8px]`,
  sections: {
    "top-left": {
      id: "top-left",
      components: topLeft,
      className:
        "top-left [&>*:first-child]:mt-[32px] flex flex-col items-center bg-[#323B4C] text-[#fff] [&_.image]:mx-auto [&_li:not(:first-child)>.heading-2]:mt-[12px] [&_.text]:mb-[4px] [&_.text]:text-[14px] [&>*:last-child]:mb-[48px]",
    },
    "top-right": {
      id: "top-right",
      components: topRight,
      className:
        "top-right [&_.heading-2]:border-none [&>*:first-child]:mt-[32px] [&>*:nth-child(even)]:mb-[8px] [&>*:nth-child(even)]:mt-1 [&>*:last-child]:mb-[16px] bg-[#fff] text-[#737373] [&_.heading-2]:text-[1.5rem] [&_.heading-2]:tracking-wider [&_.heading-2]:text-[#323B4C] [&_.heading-2]:font-light [&>*]:max-w-[450px] [&_.text]:text-[12px]",
    },
    left: {
      id: "left",
      components: left,
      className:
        "left flex flex-col [&_section]:mb-[16px] [&_.heading-2]:mb-[20px] items-center bg-[#323B4C] text-[#fff] [&_.image]:mx-auto [&_li:not(:first-child)>.heading-2]:mt-3 [&_.group]:mb-[8px] [&_.group]:grid-cols-[100px,1fr]",
    },
    right: {
      id: "right",
      components: right,
      className:
        "right [&_section]:mb-[16px] bg-white text-[#000] [&_.heading-2]:mb-[5px] [&_.heading-1]:text-[#323B4C] [&_.heading-2]:text-[#323B4C] !pr-2 [&_ul:not(:first-child)>.heading-2]:pt-[12px] [&_.text]:text-[12px] [&_.group]:grid-cols-2",
    },
  },
  intrinsic: {
    "heading-1": {
      className: "text-[50px] leading-[120%]",
    },
    "heading-2": {
      className:
        "text-[29px] tracking-[-0.039375rem] font-bold border-b-2 border-current pb-[8px]",
    },
    text: {
      className: "",
    },
    group: {
      className: "grid grid-cols-[1fr,2fr] gap-3",
    },
    "icon-group": {
      className: "grid grid-cols-[20px,1fr] gap-3",
      imageProps: { height: 20, width: 20 },
    },
  },
  image: "venusaur.png",
  pokemonImage: "venusaur-pokemon.png",
  font: "Arial",
};
