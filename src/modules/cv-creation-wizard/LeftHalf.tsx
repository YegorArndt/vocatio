import { useDraftContext } from "../draft/DraftProvider";
import { Section } from "./components/Section";
import type { RawData } from "../draft/types";
import type { ClientField, ClientSection } from "~/types/utils";

const setRawValues = (field: ClientField, rawData: RawData) => {
  const { defaultUserData, user, vacancy } = rawData;

  const predefinedFields = {
    email: user?.ownEmail || defaultUserData?.emailAddresses[0] || "",
    country: user?.ownCountry || vacancy.country || "Sweden",
    phone:
      user?.ownPhone || defaultUserData?.phoneNumbers[0] || "+46 70 123 45 67",
    address: user?.ownCity || vacancy.location || "Baker Street 221B",
    github: user?.githubUrl || "github.com/username",
    linkedin: user?.linkedInUrl || "linkedin.com/in/username",
    experience: user?.ownExperienceYears + "years" || "2 years",
    degree: "Master",
    university: "KTH",
    period: "2010 - 2015",
    skill: "React, TypeScript, Node.js, GraphQL, AWS, Docker, Kubernetes",
  };

  for (const [key, value] of Object.entries(predefinedFields)) {
    const regex = new RegExp(`${key}`, "i");

    if (regex.test(field.label)) {
      field.defaultValue = value.toString();
    }
  }

  return field;
};

const getFields = (
  sectionId: string,
  fields: ClientField[],
  rawData: RawData
): ClientField[] => {
  const matchingFields = [];

  for (const field of fields) {
    if (field.sectionId === sectionId) {
      const newField: ClientField = {
        ...field,
        order: matchingFields.length + 1,
      };
      matchingFields.push(setRawValues(newField, rawData));
    }
  }

  return matchingFields;
};

const getSortableSections = (
  sections: ClientSection[],
  fields: ClientField[],
  rawData: RawData
) => {
  const ids = sections.map((section) => section.id);
  const sortableSections: { [key: string]: string[] } = {}; // Add type for clarity

  for (const id of ids) {
    for (const field of fields) {
      if (field.sectionId === id) {
        if (!sortableSections[id]) {
          sortableSections[id] = [];
        }
        sortableSections[id].push(field.id);
      }
    }
  }

  return sortableSections; // you might want to return the result
};

export const LeftHalf = () => {
  const { state, rawData } = useDraftContext();
  const { sections, fields } = state;

  return (
    <section className="flex h-full flex-col items-center gap-10 bg-[#323B4C] py-7 pl-5 clr-white">
      {sections.map((section) => (
        <Section
          key={section.id}
          fields={getFields(section.id, fields, rawData)}
          {...section}
        />
      ))}
    </section>
  );
};
