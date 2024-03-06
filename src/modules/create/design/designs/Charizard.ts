//@ts-nocheck

import { v4 as uuidv4 } from "uuid";
import type { Design } from "../types";
import {
  contact,
  education,
  experience,
  getType,
  heading1,
  professionalSummary,
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

const pt = "pt-[70px]";
const pl = "pl-[80px]";
const pr = "pr-[80px]";

const textLeading = "leading-5";

export const Charizard: Design = {
  id: uuidv4(),
  name: "charizard",
  a4ClassName: `bg-[#fff] text-[#000]`,
  image: "charizard.png",
  pokemonImage: "charizard-pokemon.png",
  font: "garamond",
  background: "white",

  baseComponents: {
    userName: { className: "text-center text-[25px] font-medium" },
    contact: {
      className:
        // prettier-ignore
        "flex-center flex-wrap gap-[5px] w-full mt-3 text-[16px] leading-5",
    },
    professionalSummary: {
      className: `text-[14px] ${textLeading}`,
    },
    "heading-1": {
      className: `text-[14px] leading-[24px] mb-[6px] mt-[12px] border-b-[1px] font-semibold uppercase border-[#000]`,
    },
    userImage: {
      className: "rounded-full h-[140px] w-[140px]",
    },
    skills: {
      className: "flex flex-wrap w-full gap-2",
    },
    experience: {
      className:
        // prettier-ignore
        `flex 
        flex-col 
        gap-4 

        [&_.place]:text-[14px]
        [&_.place]:text-left
        [&_.place]:font-semibold

        [&_.entry-image]:w-[30px]
        [&_.entry-image]:h-[30px]

        [&_.title]:text-left

        [&_.period]:text-right

        [&_.entry-container]:!grid-cols-[40px_1fr] 
        [&_.entry-container]:gap-[10px] 
        [&_.entry-container]:mb-5

        [&_.bullet]:text-[14px] 
        [&_.bullet]:leading-[19px] 
        [&_.bullet]:ml-8
        [&_.bullet]:my-1`,
    },
    languages: {
      className: "flex flex-col gap-1 text-[14px]",
    },
    education: {
      className:
        // prettier-ignore
        `
      flex 
      flex-col 
      gap-2
   
      `,
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
      className: `bg-[#fff] text-[#000] ${pt} ${pl} ${pr}`,
      components: [
        userName({ sectionId: "left" }),
        contact({
          sectionId: "left",
          groupItemProps: {
            imageSize: 15,
          },
        }),
        heading1({
          value: "Summary",
          id: "summary-heading",
          sectionId: "left",
        }),
        professionalSummary({ sectionId: "left" }),
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
                containerClassName: "entry-container",
                image: entry.image,
                imageProps: {
                  className: "entry-image",
                },
                value: // prettier-ignore
                `<div class="flex justify-between">
                  <section class="flex flex-col">
                    <span class="place">${entry.place}</span>
                    <span class="title">${entry.title}</span>
                  </section>
                  <span class="period">${entry.period}</span>
                </div>`,
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
                containerClassName:
                  "entry-container grid-cols-[40px_1fr] gap-[10px] my-2",
                image: entry.image,
                imageProps: {
                  className: "entry-image h-[40px] w-[40px]",
                },
                value: // prettier-ignore
                `<div class="flex justify-between">
                  <section class="flex flex-col">
                    <span class="place">${entry.place}</span>
                    <span class="title">${entry.title}</span>
                  </section>
                  <span class="period">${entry.period}</span>
                </div>`,
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
