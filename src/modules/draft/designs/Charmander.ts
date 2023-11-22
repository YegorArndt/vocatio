import { v4 as uuidv4 } from "uuid";
import type { RawComponent, RawDesign } from "./types";

const CharmanderId = uuidv4();

const topLeft: RawComponent[] = [
  {
    type: "image",
    id: "user-image",
  },
];

const topRight: RawComponent[] = [
  {
    type: "heading-1",
    id: "first-name",
    props: {
      label: "First name",
      className: "uppercase text-[#fff]",
    },
    modifierIds: ["user-name"],
    modifierFn: (values) => {
      const [userName] = values;
      if (!userName) return userName;
      const [firstName] = userName.toString().split(" ");
      return { value: firstName || userName };
    },
  },
  {
    type: "heading-1",
    id: "last-name",
    props: {
      label: "Last name",
      className: "font-bold uppercase tracking-[0.2rem] text-[#fff]",
    },
    modifierIds: ["user-name"],
    modifierFn: (values) => {
      const [userName] = values;
      if (!userName) return userName;
      const [firstName, lastName] = userName.toString().split(" ");
      return { value: lastName };
    },
  },
  {
    type: "divider",
    id: "top-right-name-divider",
  },
  {
    type: "heading-2",
    id: "job-title",
    props: {
      className: "italic",
    },
  },
];

const bodyLeft: RawComponent[] = [
  {
    type: "heading-3",
    id: "charmander-profile-title",
    props: {
      value: "Profile info",
    },
  },
  {
    type: "divider",
    id: "profile-divider",
  },
  {
    type: "text",
    id: "objective",
  },
  {
    type: "heading-3",
    id: "charmander-education-title",
    props: {
      value: "Education Background",
    },
  },
  {
    type: "divider",
    id: "education-divider",
  },
  {
    type: "text",
    id: "education-university",
    props: {
      className: "font-bold",
    },
  },
  {
    type: "text",
    id: "education-degree",
    props: {
      className: "font-bold",
    },
  },
  {
    type: "text",
    id: "charmander-education-duration",
    modifierIds: ["education-duration"],
    modifierFn: (values) => {
      const [duration] = values;
      const [start, end] = duration?.toString().split("-");
      const value = !start || !end ? duration : `Completed in ${end}`;
      return { value };
    },
    props: {
      className: "font-bold",
    },
  },
  {
    type: "heading-3",
    id: "charmander-contact-title",
    props: {
      value: "My Contact",
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
      value: "short-url.com",
      label: "LinkedIn",
    },
  },
  {
    type: "group",
    id: "github",
    props: {
      value: "short-url.com",
      label: "Github",
    },
  },
];

const bodyRight: RawComponent[] = [
  {
    type: "heading-3",
    id: "charmander-experience-title",
    props: {
      value: "Professional Experience",
    },
  },
  {
    type: "divider",
    id: "charmander-experience-title-divider",
  },
];

export const Charmander: RawDesign = {
  id: CharmanderId,
  name: "Charmander",
  a4: `grid grid-cols-[300px,1fr] [&_.group]:mb-2 [&>*]:p-[2rem]`,
  sections: {
    "top-left": {
      id: "top-left",
      order: 0,
      components: topLeft,
      className: "bg-[#252E34] text-[#fff] h-[300px]",
    },
    "top-right": {
      id: "top-right",
      order: 1,
      components: topRight,
      className: "bg-[#252E34] text-[#fff] h-[300px]",
    },
    left: {
      id: "left",
      order: 3,
      components: bodyLeft,
      className:
        "bg-[#3F4C5C] h-[822px] [&_.divider]:max-w-[180px] [&_div:not(:first-child)>.heading-3]:mt-5 [&_.text]:mt-1 [&_.group]:grid [&_.group]:grid-cols-[70px,175px] [&_.group]:gap-2 [&_.group]:text-[13px]",
    },
    right: {
      id: "right",
      order: 4,
      components: bodyRight,
      className: "bg-[#fff] text-[#000] h-[822px] [&_.divider]:max-w-[180px]",
    },
  },
  intrinsic: {
    "heading-1": {
      className: "text-[50px] leading-[120%]",
    },
    "heading-2": {
      className: "text-[2rem] tracking-[-0.029375rem]",
    },
    "heading-3": {
      className: "text-[1.3rem] font-bold",
    },
    text: {},
    group: {},
    divider: {
      className: "border-current border-solid border-b-[2px] mb-5",
    },
    image: {
      height: 220,
      width: 220,
    },
  },
  font: "Inter",
  image: "/charmander.png",
  pokemonImage: "/charmander-pokemon.png",
};
