import { v4 as uuidv4 } from "uuid";
import {
  bigEntry,
  entry,
  heading,
  jobTitle,
  professionalSummary,
  userName,
} from "./utils";
import type { RawComponent, RawDesign } from "../types/raw";

const left: RawComponent[] = [
  userName({ className: "text-center" }),
  jobTitle({ type: "heading-3", props: { className: "text-center my-2" } }),
  entry({
    id: "contact",
    omitHeading: true,
    sectionProps: {
      className:
        "flex-y gap-2 text-[13px] [&_.icon-group]:gap-2 [&_.icon-group]:whitespace-nowrap mb-4",
    },
  }),
  heading({ value: "Skills", grade: 2 }),
  {
    type: "text",
    id: "skills",
    props: (data) => ({
      value: data.skills.map((x) => x.name).join("  •  "),
    }),
  },
  bigEntry({
    id: "experience",
    headingValue: "Work Experience",
    order: ["place", "title", "description"],
    place: (entry) => ({
      value: entry.place,
      className: "text-[17px] text-[#43A1FE] grid-cols-[30px,1fr] items-center",
      imageProps: { className: "rounded-full", height: 30, width: 30 },
      smallText: null,
    }),
    title: (entry) => ({
      type: "group",
      label: entry.title,
      value: entry.period,
      className: "text-[15px] font-thin tracking-wider flex-between",
      smallText: null,
    }),
    description: (entry) => ({
      value: entry.description,
      className: "my-3 text-[13px]",
    }),
    sectionClassName: "flex flex-col gap-4",
  }),
  heading({ value: "Summary", grade: 2, props: { className: "mt-[40px]" } }),
  professionalSummary({ props: { className: "text-[13px]" } }),
];

const PikachuId = uuidv4();

export const Pikachu: RawDesign = {
  id: PikachuId,
  name: "Pikachu",
  a4: `p-12 [& .text]:leading-tight [&_.group]:mb-[4px] bg-[#fff] text-[#000] [&_.icon-group]:mb-[8px]`,
  sections: {
    left: {
      id: "left",
      components: left,
      className: "",
    },
  },
  intrinsic: {
    "heading-1": {
      className: "text-[22px] uppercase font-semibold",
    },
    "heading-2": {
      className:
        "text-[20px] font-bold tracking-wider text-center border-b-2 mt-[8px] mb-[6px] border-current pb-[8px]",
    },
    "heading-3": {
      className: "text-[17px] text-[#43A1FE]",
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
  image: "pikachu.png",
  pokemonImage: "pikachu-pokemon.png",
  font: "Arial",
};
