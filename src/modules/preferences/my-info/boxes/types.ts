import type { RouterUser } from "~/modules/extension/types";

export type UserBoxes = {
  image: RouterUser["image"];
  main: {
    name: RouterUser["name"];
    jobTitle: RouterUser["jobTitle"];
    professionalSummary: RouterUser["professionalSummary"];
  };
  contact: RouterUser["contact"] & {
    email: RouterUser["email"];
    linkedin: RouterUser["linkedin"];
    address: RouterUser["address"];
  };
  languages: RouterUser["languages"];
  skills: RouterUser["skills"];
  education: RouterUser["education"];
  experience: RouterUser["experience"];
};

export type UserBox = keyof UserBoxes;
