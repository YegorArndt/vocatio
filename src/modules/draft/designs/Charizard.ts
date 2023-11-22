import { v4 as uuidv4 } from "uuid";

import type { RawComponent } from "../types/components";
import type { RawDesign } from "../types/design";

const CharizardId = uuidv4();

const leftComponents: RawComponent[] = [
  {
    type: "image",
    id: "user-image",
  },
  {
    type: "heading-1",
    id: "user-name",
    props: {
      className: "text-center",
    },
  },
  {
    type: "divider",
    id: "name-divider",
  },
  {
    type: "text",
    id: "job-title",
    props: {
      value: "Fullstack engineer",
      label: "Job title",
      className: "text-center tracking-tighter uppercase font-thin",
    },
  },
  {
    type: "heading-2",
    id: "charizard-experience-title",
    props: {
      value: "Experience",
    },
  },
  {
    type: "text",
    id: "experience",
    props: {
      value: "6 years",
    },
  },
  {
    type: "heading-2",
    id: "charizard-details-title",
    props: {
      value: "Details",
    },
  },
  {
    type: "text",
    id: "address",
    props: {
      value: "Baker Street, 221B",
    },
  },
  {
    type: "text",
    id: "country",
    props: {
      value: "British Empire",
    },
  },
  {
    type: "text",
    id: "phone",
    props: {
      value: "+7 999 999 99 99",
    },
  },
  {
    type: "text",
    id: "email",
    props: {
      value: "fullstack@gmail.com",
    },
  },
  {
    type: "heading-2",
    id: "skills-title",
    props: {
      value: "Skills",
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
];

const rightComponents: RawComponent[] = [
  {
    type: "heading-2",
    id: "charizard-profile-title",
    props: {
      value: "Profile",
    },
  },
  {
    type: "text",
    id: "objective",
    props: {
      value:
        "I am a frontend developer with 3 years of experience. I am looking for a job in a company with a friendly team and interesting projects.",
    },
  },
  {
    type: "heading-2",
    id: "charizard-employment-history-title",
    props: {
      value: "Employment History",
    },
  },
];

export const Charizard: RawDesign = {
  id: CharizardId,
  name: "Charizard",
  a4: "grid grid-cols-[300px_1fr] bg-white",
  sections: {
    left: {
      id: "left",
      order: 0,
      components: leftComponents,
      className:
        "flex items-center h-full flex-col bg-[#064C40] p-8 clr-white [&_.image]:mx-auto",
    },
    right: {
      id: "right",
      order: 1,
      components: rightComponents,
      className: "bg-white p-[2rem] clr-black",
    },
  },
  intrinsic: {
    "heading-1": {
      className: "text-[30px] font-bold",
    },
    "heading-2": {
      className: "text-[1.3rem] font-bold my-[4%]",
    },
    "heading-3": {
      className: "text-[1rem] font-bold mb-[2%]",
    },
    text: {},
    group: {
      className: "grid grid-cols-[100px,160px] gap-2",
    }, // not using yet
    divider: {
      className:
        "border-current border-solid border-b-[0.5px] w-[2rem] mx-auto my-2",
    },
    image: {
      className: "rounded-full mb-5",
      height: 100,
      width: 100,
    },
  },
  font: "Arial",
  image: "/charizard.png",
  pokemonImage: "/charizard-pokemon.png",
};
