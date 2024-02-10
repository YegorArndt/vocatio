//@ts-nocheck

import { v4 as uuidv4 } from "uuid";
import type { Design } from "../types";
import {
  contact,
  heading1,
  jobTitle,
  userName,
  userImage,
  professionalSummary,
  skills,
  experience,
  getType,
  languages,
  education,
} from "./utils";
import { boldKeywords } from "~/server/api/utils/generate-cv/utils";

const blueColor = "bg-[#22405C]";
const grayColor = "#BDBDBD";
const expHeading = "text-[17px] leading-7";
const pl = "pl-[25px]";
const pr = "pr-[15px]";
const pt = "pt-[46px]";

const leftPl = "pl-[35px]";
const leftPr = "pr-[30px]";

const textLeading = "leading-5";

export const Charmander: Design = {
  id: uuidv4(),
  name: "Charmander",
  a4ClassName: `grid-cols-[1fr_250px] bg-[#fff] text-[#000] tracking-tight`,
  image: "charmander.png",
  pokemonImage: "charmander-pokemon.png",
  font: "Arial",
  background: "white",

  baseComponents: {
    professionalSummary: {
      className: `text-[13px] ${textLeading}`,
    },
    "heading-1": {
      className: `text-[20px] leading-[24px] pb-[5px] mb-[5px] mt-[15px] border-b-[1px] uppercase border-[${grayColor}]`,
    },
    contact: {
      className: "flex-y flex-wrap gap-[5px] py-4",
    },
    userImage: {
      className: "rounded-full h-[140px] w-[140px]",
    },
    skills: {
      className:
        "flex flex-wrap w-full gap-2 [&>*]:bg-[#3A5068] [&>*]:p-1 [&>*]:rounded-md",
    },
    experience: {
      className: "flex flex-col gap-4",
    },
    languages: {
      className: "flex flex-col gap-1 text-[13px]",
    },
    education: {
      className: "flex flex-col gap-2",
    },
  },

  sections: {
    "top-left": {
      id: "top-left",
      className: `bg-[#fff] text-[#000] ${pt} ${leftPl} ${leftPr}`,
      components: [
        userName(),
        jobTitle(),
        contact({
          groupItemProps: {
            imageSize: 15,
            containerClassName: "gap-2",
            valueProps: { className: "text-[13px]" },
          },
        }),
      ],
    },

    "top-right": {
      id: "top-right",
      className: `${blueColor} text-[#fff] ${pt} ${pr} ${pl}`,
      components: [userImage({ sectionId: "right" })],
    },

    left: {
      id: "left",
      className: `bg-[#fff] text-[#000] ${leftPr} ${leftPl}`,
      components: [
        heading1({
          value: "Summary",
          id: "professionalSummary-heading",
          sectionId: "left",
        }),
        professionalSummary(),
        heading1({
          value: "Experience",
          id: "experience-heading",
          sectionId: "left",
        }),
        experience({
          components: (entry, len) => [
            {
              id: entry.id + "-title",
              sectionId: "experience",
              type: "group",
              hydratedProps: {
                label: entry.title,
                value: entry.period,

                labelProps: { className: `${expHeading}` },
                containerClassName: "!grid-cols-2 text-[#384347]",
              },
            },
            {
              id: entry.id + "-place",
              sectionId: "experience",
              type: getType(entry),
              hydratedProps: {
                image: entry.image,
                value: entry.place,
                valueProps: { className: `${expHeading} text-[#008cff]` },
                imageProps: { className: "w-[40px] h-[40px] rounded-full" },

                containerClassName: "grid-cols-[40px_1fr] gap-[10px]",
              },
            },
            /**
             * Show only 3 first bullet points if the experience history is longer than 2
             */
            ...entry.generatedDescription?.map((bulletPoint, i) => ({
              id: entry.id + i + "-bullet",
              sectionId: "experience",
              type: "text",
              hydratedProps: {
                value: boldKeywords(
                  bulletPoint,
                  entry.skills.join(" ")
                ).replace("•", ""),
                valueProps: {
                  className: `text-[#384347] text-[13px] ${textLeading}`,
                },
              },
            })),
          ],
        }),
      ],
    },

    right: {
      id: "right",
      className: `${blueColor} text-[#fff] ${pr} ${pl}`,
      components: [
        heading1({ value: "Skills", id: "skills-heading", sectionId: "right" }),
        skills({
          type: "icon-group",
          groupItemProps: { valueProps: { className: "w-full text-[13px]" } },
        }),
        heading1({
          value: "Languages",
          id: "languages-heading",
          sectionId: "right",
        }),
        languages({
          sectionId: "right",
          groupItemProps: { containerClassName: "!grid-cols-2" },
        }),
        heading1({
          value: "Education",
          id: "Education-heading",
          sectionId: "right",
        }),
        education({
          sectionId: "right",
          components: (entry) => [
            {
              id: entry.id + "-place",
              sectionId: "education",
              type: getType(entry),
              hydratedProps: {
                image: entry.image,
                value: entry.place,

                containerClassName: "grid-cols-[40px_1fr] gap-[10px] py-[5px]",
                imageProps: {
                  height: 40,
                  width: 40,
                  className: "rounded-full",
                },
                valueProps: { className: "leading-4" },
              },
            },
            {
              id: entry.id + "-title",
              sectionId: "education",
              type: "text",
              hydratedProps: {
                value: entry.title,
                valueProps: { className: "text-[13px] border-top py-[3px]" },
              },
            },
            {
              id: entry.id + "-period",
              sectionId: "education",
              type: "text",
              hydratedProps: {
                value: entry.period,
                valueProps: { className: "text-[13px] border-top pt-[3px]" },
              },
            },
          ],
        }),
      ],
    },
  },
};
