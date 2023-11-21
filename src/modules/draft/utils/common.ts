import type { User, Vacancy } from "@prisma/client";
import type { Defaults } from "../constants";
import type { TypeOfComponent } from "../types/components";
import type { UserResource } from "@clerk/types";
import { stories, highlights } from "~/modules/create/constants/frontend";

export const typedKeys = <T extends object>(o: T): (keyof T)[] => {
  return Object.keys(o) as (keyof T)[];
};

export const getDefaults = (
  user: User,
  defaultUserData: UserResource,
  vacancy: Vacancy
): Defaults => {
  return {
    "user-name": user.ownName || defaultUserData.fullName,
    "job-title": user.ownJobTitle || vacancy.jobTitle,
    objective:
      user.ownObjective ||
      "I have over six years of experience as a full-stack developer, collaborating with sectors such as banking, cryptocurrency, advertising, and software development. I have also launched my own products as an entrepreneur. In my career, I've worked with major enterprises and taken on leadership roles. My focus has always been on teamwork, especially in challenging situations. I am committed to my work and am looking for opportunities to contribute to interesting projects, especially startups.",
    email: defaultUserData.emailAddresses[0]?.emailAddress,
    experience: user.ownExperienceYears || vacancy.requiredYears,
    "skills-list": vacancy.requiredSkills,
    country: user.ownCountry || vacancy.country,
    address: vacancy.country,
    phone: user.ownPhone || defaultUserData.phoneNumbers[0]?.phoneNumber,
    linkedin: user.linkedInUrl,
    github: user.githubUrl,
    "education-duration": "2016-2020",
    "education-degree": "Master degree",
    "education-university": "MSU, Computer Science",
    "english-level": "C1",
    "russian-level": "C1",
    "german-level": "C1",
    "spanish-level": "C1",
    city: user.ownCity || vacancy.country,
    "user-image": user.ownImage || defaultUserData.imageUrl,
    "user-stories": user?.ownStories || stories,
    "user-stories-highlights": user?.ownStoriesHighlights || highlights,
  };
};

export const isDecoration = (t: TypeOfComponent) =>
  ["image", "divider"].includes(t);

// vacancyId: vacancy.id,
// jobDescription: vacancy.description || "",
// jobTitle: vacancy.jobTitle || user.ownJobTitle || "",
