//@ts-nocheck

import { v4 as uuidv4 } from "uuid";
import type { Design } from "../types";
import {
  contact,
  education,
  experience,
  getType,
  heading1,
  userName,
} from "./utils";
import { Cv } from "~/modules/init-gen/types";

const boldKeywords = (text: string, keywords: string) => {
  const vacancyWords = new Set(keywords.toLowerCase().match(/\w+/g));

  return text.replace(/\w+/g, (word) => {
    if (vacancyWords.has(word.toLowerCase())) {
      return `<span class="font-bold">${word}</span>`;
    }
    return word;
  });
};

const pt = "pt-[46px]";

const leftPl = "pl-[50px]";
const leftPr = "pr-[30px]";

const textLeading = "leading-5";

export const Charmeleon: Design = {
  id: uuidv4(),
  name: "Charmeleon",
  a4ClassName: `bg-[#fff] text-[#000]`,
  image: "charmeleon.png",
  pokemonImage: "charmeleon-pokemon.png",
  font: "garamond",
  background: "white",

  baseComponents: {
    userName: { className: "normalcase text-[34px] font-semibold" },
    professionalSummary: {
      className: `text-[15px] ${textLeading}`,
    },
    "heading-1": {
      className: `text-[15.5px] leading-[24px] pb-[2px] mb-[5px] mt-[7px] border-b-[1.2px] font-semibold uppercase border-[#000]`,
    },
    contact: {
      className:
        "flex-y flex-wrap gap-[5px] w-full pt-4 pb-1 mb-[17px] border-b-[1.2px] border-[#000]",
    },
    userImage: {
      className: "rounded-full h-[140px] w-[140px]",
    },
    skills: {
      className: "flex flex-wrap w-full gap-2",
    },
    experience: {
      className:
        "flex flex-col gap-4 [&_*.title-container]:!grid-cols-2 [&_*.title-container]:text-[17px] [&_*.title-container]:font-bold [&_*.title-container]:leading-7 [&_*.title-value]:text-right [&_*.place-container]:!grid-cols-[40px_1fr] [&_*.place-container]:gap-[10px] [&_*.place-value]:text-[17px] [&_*.place-value]:leading-7 [&_*.place-value]:font-bold [&_*.place-image]:w-[40px] [&_*.place-image]:h-[40px] [&_*.place-image]:rounded-full [&_*.bullet]:text-[15px] [&_*.bullet]:leading-5 [&_*.bullet]:my-1",
    },
    languages: {
      className: "flex flex-col gap-1 text-[14px]",
    },
    education: {
      className: "flex flex-col gap-2",
    },
    text: {
      className: "text-[15px] leading-5",
    },
    bullet: {
      className: "text-[15px] leading-5",
    },
  },

  sections: {
    left: {
      id: "top-left",
      className: `bg-[#fff] text-[#000] ${pt} ${leftPl} ${leftPr}`,
      components: [
        userName({ sectionId: "left" }),
        contact({
          sectionId: "left",
          groupItemProps: {
            imageSize: 15,
            containerClassName: "gap-2",
            valueProps: { className: "text-[16px] leading-5" },
          },
        }),
        heading1({
          value: "Work Experience",
          id: "work-experience-heading",
          sectionId: "left",
        }),
        experience({
          sectionId: "left",
          components: (entry) => [
            {
              id: entry.id + "-place",
              sectionId: entry.id,
              type: getType(entry),
              hydratedProps: {
                image: entry.image,
                value: entry.place,

                labelProps: { className: "place-label" },
                valueProps: { className: "place-value" },
                imageProps: { className: "place-image" },
                containerClassName: "place-container",
              },
            },
            {
              id: entry.id + "-title",
              sectionId: entry.id,
              type: "group",
              hydratedProps: {
                label: entry.title,
                value: entry.period,

                labelProps: { className: "place-label" },
                valueProps: { className: "place-value" },
                imageProps: { className: "place-image" },
                containerClassName: "place-container",
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
                  bullet.value,
                  entry?.skills?.join(" ")
                )?.replace("•", ""),

                valueProps: { className: "bullet" },
              },
            })),
          ],
        }),
        heading1({
          value: "Education",
          id: "education-heading",
          sectionId: "left",
        }),
        education({
          sectionId: "left",
          components: (entry) => [
            {
              id: entry.id + "-place",
              sectionId: "education",
              type: getType(entry),
              hydratedProps: {
                image: entry.image,
                value: `<div class="flex-between">
                  <section class="flex flex-col items-start">
                    <b>${entry.place}</b>
                    <p>${entry.title}</p>
                  </section>
                  <b>${entry.period}</b>
                </div>`,
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
              id: entry.id + "-description",
              sectionId: "education",
              type: "text",
              hydratedProps: {
                value: entry.description,
                valueProps: {
                  className: "text-[14px] border-top py-[3px]",
                },
              },
            },
          ],
        }),
        heading1({
          value: "Skills",
          id: "skills-heading",
          sectionId: "left",
        }),
        {
          type: "skills",
          id: "skills",
          sectionId: "left",
          hydratableProps: (cv: Cv) => ({
            sections: {
              skills: {
                components:
                  cv?.skills?.map((entry) => ({
                    id: entry.id,
                    sectionId: "skills",
                    type: "text",
                    hydratedProps: {
                      value: `${entry.name};`,
                    },
                  })) || [],
              },
            },
          }),
        },
      ],
    },
  },
};
