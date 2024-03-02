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

const boldKeywords = (text: string, keywords: string) => {
  const vacancyWords = new Set(keywords.toLowerCase().match(/\w+/g));

  return text.replace(/\w+/g, (word) => {
    if (vacancyWords.has(word.toLowerCase())) {
      return `<span class="font-bold">${word}</span>`;
    }
    return word;
  });
};

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
  font: "rubik",
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
      className:
        "flex flex-col gap-4 text-[#384347] [&_*.title-container]:!grid-cols-2 [&_*.title-label]:text-[17px] [&_*.title-label]:leading-7 [&_*.title-value]:text-right [&_*.place-container]:!grid-cols-[40px_1fr] [&_*.place-container]:gap-[10px] [&_*.place-value]:text-[17px] [&_*.place-value]:leading-7 [&_*.place-value]:text-[#008cff] [&_*.place-image]:w-[40px] [&_*.place-image]:h-[40px] [&_*.place-image]:rounded-full [&_*.bullet]:text-[13px] [&_*.bullet]:leading-5 [&_*.bullet]:my-1",
    },
    languages: {
      className: "flex flex-col gap-1 text-[13px]",
    },
    education: {
      className: "flex flex-col gap-2",
    },
    text: {
      className: "text-[13px] leading-5",
    },
    bullet: {
      className: "text-[13px] leading-5",
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
          components: (entry) => [
            {
              id: entry.id + "-place",
              sectionId: entry.id,
              type: getType(entry),
              hydratedProps: {
                image: entry.image,
                value: // prettier-ignore
                `<div class="flex justify-between">
                  <section class="flex flex-col">
                    <span class="font-bold text-left ${expHeading}">${entry.place}</span>
                    <span class="italic text-left">${entry.title}</span>
                  </section>
                  <span class="font-bold leading-7">${entry.period}</span>
                </div>`,
                containerClassName: "grid-cols-[40px_1fr] gap-[10px] pb-[10px]",
                imageProps: {
                  height: 40,
                  width: 40,
                  className: "rounded-full",
                },

                labelProps: { className: "title-label" },
                valueProps: { className: "title-value" },
              },
            },
            /**
             * Bullet points.
             */
            ...entry.bullets.map((bullet) => ({
              id: bullet.id,
              sectionId: entry.id,
              type: "bullet",
              hydratedProps: {
                value: boldKeywords(
                  bullet.text,
                  entry?.skills?.join(" ")
                )?.replace("•", ""),

                valueProps: {
                  className: "bullet",
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
                valueProps: {
                  className: "text-[13px] border-top py-[3px]",
                },
              },
            },
            {
              id: entry.id + "-period",
              sectionId: "education",
              type: "text",
              hydratedProps: {
                value: entry.period,
                valueProps: {
                  className: "text-[13px] border-top pt-[3px]",
                },
              },
            },
          ],
        }),
      ],
    },
  },
};
