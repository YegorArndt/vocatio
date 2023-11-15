import { v4 as uuidv4 } from "uuid";
import type { DraftComponent, Design } from "../types";

const CharizardId = uuidv4();

const leftComponents = [
  {
    type: "image",
    id: "user-image",
    props: {
      className: "mx-auto",
    },
  },
  {
    type: "heading-1",
    id: "user-name",
    props: {
      value: "",
      label: "",
      className: "text-center",
    },
  },
  {
    type: "divider",
    id: "name-divider",
    props: {
      value: "",
      label: "",
    },
  },
  {
    type: "text",
    id: "job-title",
    props: {
      value: "Fullstack engineer",
      label: "",
      className: "text-center tracking-tighter uppercase font-thin",
    },
  },
  {
    type: "heading-2",
    id: "experience-title",
    props: {
      value: "Experience",
      label: "",
    },
  },
  {
    type: "text",
    id: "experience",
    props: {
      value: "",
      label: "",
    },
  },
  {
    type: "heading-2",
    id: "details-title",
    props: {
      value: "Details",
      label: "",
    },
  },
  {
    type: "text",
    id: "address",
    props: {
      value: "Baker Street, 221B",
      label: "",
    },
  },
  {
    type: "text",
    id: "country",
    props: {
      value: "British Empire",
      label: "",
    },
  },
  {
    type: "text",
    id: "phone",
    props: {
      value: "+7 999 999 99 99",
      label: "",
    },
  },
  {
    type: "text",
    id: "email",
    props: {
      value: "fullstack@gmail.com",
      label: "",
    },
  },
  {
    type: "heading-2",
    id: "skills-title",
    props: {
      value: "Skills",
      label: "",
    },
  },
  {
    type: "text",
    id: "skill 2",
    props: {
      value: "• first skill",
      label: "",
    },
  },
  {
    type: "text",
    id: "skill 3",
    props: {
      value: "• second skill",
      label: "",
    },
  },
  {
    type: "text",
    id: "skill 4",
    props: {
      value: "• third skill",
      label: "",
    },
  },
  {
    type: "text",
    id: "skill 5",
    props: {
      value: "• fourth skill",
      label: "",
    },
  },
].map((c, order) => ({
  ...c,
  order: order + 1,
  sectionId: "left",
})) as DraftComponent[];

const rightComponents = [
  {
    type: "heading-2",
    id: "profile-title",
    props: {
      value: "Profile",
      label: "",
    },
  },
  {
    type: "text",
    id: "objective",
    props: {
      value:
        "I am a frontend developer with 3 years of experience. I am looking for a job in a company with a friendly team and interesting projects.",
      label: "",
    },
  },
  {
    type: "heading-2",
    id: "employment-history-title",
    props: {
      value: "Employment History",
      label: "",
    },
  },
  {
    type: "timeline",
    id: "timeline",
    props: {},
  },
].map((c, order) => ({
  ...c,
  order: order + 1,
  sectionId: "right",
})) as DraftComponent[];

export const Charizard: Design = {
  id: CharizardId,
  name: "Charizard",
  a4: "grid grid-cols-[300px_1fr] bg-white",
  sections: {
    left: {
      id: "left",
      order: 0,
      components: leftComponents,
      className: "flex items-center h-full flex-col bg-[#064C40] p-8 clr-white",
    },
    right: {
      id: "right",
      order: 1,
      components: rightComponents,
      className: "bg-white p-[2rem] clr-black",
    },
  },
  components: {
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
    timeline: {
      styles: {
        timelineClassNames: "",
        storyClassNames: "relative pb-4 first:mt-4 flex flex-col order-3",
        dateOfEmploymentClassNames:
          "uppercase text-[#808080] tracking-wider order-2 my-2",
        companyNameClassNames: "w-full text-[1rem] font-bold order-1",
        jobTitleClassNames: "hidden",
        ballClassNames: "hidden",
        lineClassNames: "hidden",
      },
      jobDescription: "",
      jobTitle: "",
      vacancyId: "",
    },
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
