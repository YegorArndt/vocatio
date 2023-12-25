import type { UserResource } from "@clerk/types";
import type { SkillEntry, Vacancy } from "@prisma/client";
import { omitBy, isNil } from "lodash-es";
import { RouterOutputs } from "~/utils/api";

export type Defaults = ReturnType<typeof getDefaults>;

const findStringsInText = (text: string, entries: SkillEntry[]) => {
  const intersections = [];
  const lowerCaseTextWords = text.toLowerCase().split(/\s+/);

  let isJavaScriptFound = false;
  let isTypeScriptFound = false;

  for (const entry of entries) {
    const lowercaseEntryWords = entry.name.toLowerCase().split(/\s+|\.+/); // Split by spaces and dots

    const isMatch = lowercaseEntryWords.some((word) =>
      lowerCaseTextWords.includes(word)
    );

    if (isMatch) {
      if (lowercaseEntryWords.includes("javascript")) {
        isJavaScriptFound = true;
      } else if (lowercaseEntryWords.includes("typescript")) {
        isTypeScriptFound = true;
      }
      intersections.push(entry);
    }
  }

  // Apply the condition after completing the search
  if (isJavaScriptFound && isTypeScriptFound) {
    return intersections.filter(
      (entry) => !entry.name.toLowerCase().includes("javascript")
    );
  }

  return intersections;
};

const readonlyKeys = ["id", "createdAt", "updatedAt", "userId", "user"];
const clean = (
  o: RouterOutputs["users"]["get"]["contact"],
  keys = readonlyKeys
) => omitBy(o, (value, key) => keys.includes(key) || isNil(value));

export const getDefaults = (
  user: RouterOutputs["users"]["get"],
  defaultUserData: UserResource,
  vacancy: Vacancy
) => {
  const topSkills = findStringsInText(vacancy.requiredSkills, user.skills);
  // const linkedin = `vocat.io/${user.shortLinkedin?.shortUrl}.com`;

  return {
    vacancy,
    logo: vacancy.image,
    companyName: vacancy.companyName,
    topSkills,
    name: user.name || defaultUserData.fullName!,
    jobTitle: vacancy.jobTitle || user.jobTitle!,
    professionalSummary: user.professionalSummary || "",
    email:
      user.contact?.email ??
      defaultUserData.emailAddresses[0]?.emailAddress ??
      "Your email",
    "phone-number":
      user.contact?.phone || defaultUserData.phoneNumbers[0]?.phoneNumber,
    contact: clean(user.contact) ?? {},
    education: user.education ?? [],
    experience: vacancy.requiredYearsMax,
    employmentHistory: user.employmentHistory,
    skills: user.skills ?? vacancy.requiredSkills,
    location: user.contact?.location || vacancy.location,
    country: user.contact?.country || vacancy.country,
    address: user.contact?.address || vacancy.country,
    phone: user.contact?.phone || defaultUserData.phoneNumbers[0]?.phoneNumber,
    linkedin: `linkedin.com/in/${user.contact?.linkedin}`,
    github: user.contact?.github,
    languages: user.languages ?? vacancy.requiredLanguages,
    city: user.contact?.city || vacancy.country,
    userImage: user.image || defaultUserData.imageUrl,
  };
};

export const defaultsKeys = [
  "userImage",
  "topSkills",
  "name",
  "jobTitle",
  "professionalSummary",
  "email",
  "phone-number",
  "contact",
  "experience",
  "employmentHistory",
  "skills",
  "location",
  "country",
  "address",
  "phone",
  "linkedin",
  "github",
  "education",
  "languages",
  "city",
  "image",
];
