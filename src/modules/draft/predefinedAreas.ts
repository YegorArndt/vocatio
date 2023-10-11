import type { DraftComponent } from "./types";

export const LEFT_HALF = "LEFT_HALF";

export const leftHalfComponents = [
  {
    component: "H3_WITH_DIVIDER",
    label: "General",
    defaultValue: "General",
    placeholder: "General",
  },
  {
    component: "TEXT_WITH_LABEL",
    label: "Experience",
    defaultValue: "3 years",
    placeholder: "1 year 6 months",
  },
  {
    component: "TEXT_WITH_LABEL",
    label: "Country",
    defaultValue: "USA",
    placeholder: "Ukraine",
  },
  {
    component: "H3_WITH_DIVIDER",
    label: "Contact",
    defaultValue: "Contact",
    placeholder: "Contact",
  },
  {
    component: "TEXT_WITH_LABEL",
    label: "Email",
    defaultValue: "perfect-candidate@gmail.com",
    placeholder: "Your email",
  },
  {
    component: "URL",
    label: "LinkedIn",
    defaultValue: "lkdin.com/example",
    placeholder: "We'll shorten it up",
  },
  {
    component: "URL",
    label: "Github",
    defaultValue: "github.com/example",
    placeholder: "We'll shorten it up",
  },
  {
    component: "TEXT_WITH_LABEL",
    label: "Address",
    defaultValue: "Baker Street, 221B",
  },
  {
    component: "PHONE_NUMBER",
    label: "Phone",
    defaultValue: "+380 00 000 00 00",
  },
  {
    component: "H3_WITH_DIVIDER",
    label: "Education",
    defaultValue: "Education",
  },
  {
    component: "TEXT",
    label: "Period",
    defaultValue: "2016-2020",
  },
  {
    component: "TEXT",
    label: "Degree",
    defaultValue: "Master degree",
  },
  {
    component: "TEXT",
    label: "University",
    defaultValue: "MSU, Computer Science",
  },
  {
    component: "H3_WITH_DIVIDER",
    label: "Skills",
    defaultValue: "Skills",
  },
  {
    component: "SELECT",
    label: "Choose skills",
    defaultValue: "React, Node.js, TypeScript",
  },
].map((c, index) => ({
  ...c,
  index,
  name: `predefined-${c.label}`,
  id: `predefined-${c.label}`,
  areaId: LEFT_HALF,
})) as DraftComponent[];
