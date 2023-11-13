import { v4 as uuidv4 } from "uuid";
import type { DraftComponent, Design } from "../types";

const VenusaurId = uuidv4();

const leftComponents = [
  {
    type: "heading 2",
    id: "general-title",
    props: {
      value: "General",
      label: "",
    },
  },
  {
    type: "divider",
    id: "general-divider",
    props: {
      value: "General",
      label: "",
    },
  },
  {
    type: "group",
    id: "experience",
    props: {
      value: "3 years",
      label: "Experience",
    },
  },
  {
    type: "group",
    id: "country",
    props: {
      value: "USA",
      label: "Country",
    },
  },
  {
    type: "heading 2",
    id: "contact-title",
    props: {
      value: "Contact",
      label: "",
    },
  },
  {
    type: "divider",
    id: "contact-divider",
    props: {
      value: "General",
      label: "",
    },
  },
  {
    type: "group",
    id: "email",
    props: {
      value: "perfect-candidate@gmail.com",
      label: "Email",
    },
  },
  {
    type: "group",
    id: "linkedin",
    props: {
      value: "https://www.linkedin.com/in/alexander-ivanov-123456789/",
      label: "LinkedIn",
    },
  },
  {
    type: "group",
    id: "github",
    props: {
      value: "https://www.linkedin.com/in/alexander-ivanov-123456789/",
      label: "Github",
    },
  },
  {
    type: "group",
    id: "address",
    props: {
      value: "Baker Street, 221B",
      label: "Address",
    },
  },
  {
    type: "heading 2",
    id: "education-title",
    props: {
      value: "Education",
      label: "",
    },
  },
  {
    type: "divider",
    id: "education-divider",
    props: {
      value: "General",
      label: "",
    },
  },
  {
    type: "text",
    id: "education-duration",
    props: {
      value: "2016-2020",
      label: "Duration",
    },
  },
  {
    type: "text",
    id: "education-degree",
    props: {
      name: "education-degree",
      value: "Master degree",
      label: "Degree",
    },
  },
  {
    type: "text",
    id: "education-university",
    props: {
      value: "MSU, Computer Science",
      label: "University",
    },
  },
  {
    type: "heading 2",
    id: "skills-title",
    props: {
      value: "Skills",
      label: "",
    },
  },
  {
    type: "divider",
    id: "skills-divider",
    props: {
      value: "General",
      label: "",
    },
  },
  {
    type: "text",
    id: "skills-list",
    props: {
      value: "React, Node.js, TypeScript, GraphQL, MongoDB, PostgreSQL",
      label: "",
    },
  },
  {
    type: "heading 2",
    id: "languages-title",
    props: {
      value: "Languages",
      label: "",
    },
  },
  {
    type: "divider",
    id: "languages-divider",
    props: {
      value: "General",
      label: "",
    },
  },
  {
    type: "group",
    id: "english-level",
    props: {
      value: "C1",
      label: "English",
    },
  },
  {
    type: "group",
    id: "russian-level",
    props: {
      value: "Native",
      label: "Russian",
    },
  },
].map((c, order) => ({
  ...c,
  order: order + 1,
  sectionId: "left",
})) as DraftComponent[];

const rightComponents = [
  {
    type: "heading 1",
    id: "user-name",
    props: {
      value: "Alexander Ivanov",
      label: "",
    },
  },
  {
    type: "heading 3",
    id: "job-title",
    props: {
      value: "Frontend developer",
      label: "",
    },
  },
  {
    type: "heading 2",
    id: "employment-history-title",
    props: {
      value: "Experience",
      label: "",
    },
  },
  {
    type: "divider",
    id: "experience-divider",
    props: {
      value: "General",
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
})) as DraftComponent[];

export const Venusaur: Design = {
  id: VenusaurId,
  name: "Venusaur",
  a4: "grid grid-cols-[300px_1fr] bg-white",
  sections: {
    left: {
      id: "left",
      order: 0,
      components: leftComponents,
      className:
        "flex h-full flex-col items-center bg-[#323B4C] px-5 py-7 clr-white",
    },
    right: {
      id: "right",
      order: 1,
      components: rightComponents,
      className: "bg-white px-[2rem] py-[3rem] clr-black",
    },
  },
  components: {
    "heading 1": "text-[50px] font-bold text-[#323B4C]",
    "heading 2": "text-[2rem] tracking-[-0.029375rem] font-bold mt-2",
    "heading 3": "text-[1rem] mb-[2%]",
    text: "",
    group: "grid grid-cols-[100px,160px] gap-2",
    timeline: {
      styles: {
        timelineClassNames: "",
        storyClassNames: "relative pb-4 first:mt-4",
        dateOfEmploymentClassNames: "w-full text-[1rem] font-bold",
        companyNameClassNames: "w-full text-[1rem] font-bold",
        jobTitleClassNames: "w-full italic",
      },
      jobDescription: "",
      jobTitle: "",
      vacancyId: "",
    },
    divider: "border-current border-solid border-b-[2px] mb-2",
  },
  font: "Inter",
  image: "/add.png",
};
