import { v4 as uuidv4 } from "uuid";
import { bigEntry, heading, professionalSummary, userName } from "./utils";
import type { RawComponent, RawDesign } from "../types/raw";

const left: RawComponent[] = [
  userName({}),
  {
    type: "text",
    id: "contact",
    props: (data) => ({
      value: data.contact.map((c) => c.value).join(" | "),
    }),
  },
  heading({ value: "Skills", grade: 2 }),
  {
    type: "text",
    id: "skills",
    props: (data) => ({
      value: [...data.languages, ...data.skills].map((s) => s.name).join(" | "),
    }),
  },
  bigEntry({
    id: "education",
    headingValue: "Education",
    headingGrade: 2,
    order: ["title", "place"],
    title: (entry) => ({
      className: "text-[15px] uppercase w-full !grid-cols-[2fr,1fr]",
      type: "group",
      label: entry.title,
      value: entry.period,
      labelProps: { className: "font-bold" },
    }),
    place: (entry) => ({
      type: "text",
      value: `• ${entry.place}`,
      className: "text-[12px]",
      smallText: null,
    }),
  }),
  bigEntry({
    id: "experience",
    headingValue: "Professional Experience",
    order: ["title", "description"],
    title: (entry) => ({
      value: `${entry.title} | ${entry.place} | ${entry.period}`,
      className: "text-[15px] uppercase font-bold",
    }),
    description: (entry) => ({
      value: entry.description,
      className: "pl-6 text-[12px]",
    }),
    entryClassName: "[&>*:last-child]:mb-5 [&>*:last-child]:mt-2",
  }),
  heading({ value: "Summary", grade: 2 }),
  professionalSummary(),
];

const NidoranId = uuidv4();

export const Nidoran: RawDesign = {
  id: NidoranId,
  name: "Nidoran",
  a4: `p-20 [& .text]:leading-tight [&_.group]:mb-[4px] bg-[#fff] text-[#000] [&_.icon-group]:mb-[8px]`,
  sections: {
    left: {
      id: "left",
      components: left,
      className: "",
    },
  },
  intrinsic: {
    "heading-1": {
      className: "text-[18px] font-semibold mb-[8px] uppercase",
    },
    "heading-2": {
      className: "text-[15px] uppercase bg-[#B7B7B7] font-bold mt-4 mb-2",
    },
    "heading-3": {
      className: "text-[29px] font-bold border-b-2 border-current pb-[8px]",
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
  image: "nidoran.png",
  pokemonImage: "nidoran-pokemon.png",
  font: "Arial",
};
