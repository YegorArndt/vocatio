import { v4 as uuidv4 } from "uuid";

import type { RawComponent } from "../types/components";
import type { RawDesign } from "../types/design";

const CharmanderId = uuidv4();

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
      className: "uppercase flex flex-col text-[50px] leading-[120%]",
      classNameLast: "font-bold",
    },
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
    type: "text",
    id: "professionalSummary",
  },
  {
    type: "heading-3",
    id: "charmander-education-title",
    props: {
      value: "Education Background",
    },
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
    id: "education-duration",
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
    type: "icon-group",
    id: "email",
    props: {
      img: "email",
      label: "Email",
    },
  },
  {
    type: "icon-group",
    id: "linkedin",
    props: {
      img: "linkedin",
      value: "short-url.com",
      label: "LinkedIn",
    },
  },
  {
    type: "icon-group",
    id: "github",
    props: {
      img: "github",
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
    type: "decorated-timeline",
    id: "user-stories",
  },
];

export const Charmander: RawDesign = {
  id: CharmanderId,
  name: "Charmander",
  a4: `grid-cols-[300px,1fr] [&_.group]:mb-2 [&>*]:px-[2rem]`,
  sections: {
    "top-left": {
      id: "top-left",
      order: 0,
      components: topLeft,
      className:
        "top-left bg-[#252E34] text-[#fff] [&>*:first-child]:mt-[1rem] [&>*:first-child]:mb-[2rem]",
    },
    "top-right": {
      id: "top-right",
      order: 1,
      components: topRight,
      className:
        "top-right [&>*:first-child]:mt-[1rem] bg-[#252E34] text-[#fff] [&>*:last-child]:mb-[3.5rem]",
    },
    left: {
      id: "left",
      order: 3,
      components: bodyLeft,
      className:
        "left bg-[#3F4C5C] [&>*:first-child]:mt-[2rem] [&_div:not(:first-child)>.heading-3]:mt-5 [&_.text]:mt-1 [&_.group]:grid [&_.group]:grid-cols-[70px,175px] [&_.group]:gap-2 [&_.group]:text-[13px] [&_.icon-group]:mb-2",
    },
    right: {
      id: "right",
      order: 4,
      components: bodyRight,
      className: "right bg-[#fff] text-[#000]  [&>*:first-child]:mt-[2rem]",
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
      className:
        "text-[1.3rem] font-bold after:content-[''] after:block after:h-[2px] after:w-[180px] after:bg-current after:mt-2 after:mb-4",
    },
    text: {},
    group: {},
    image: {
      height: 220,
      width: 220,
    },
  },
  font: "Inter",
  image: "/charmander.png",
  pokemonImage: "/charmander-pokemon.png",
};
