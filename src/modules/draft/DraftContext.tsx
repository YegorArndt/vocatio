import { createContext, useContext, useState } from "react";
import type { UserResource } from "@clerk/types";
import { Vacancy } from "@prisma/client";

export type Component = {
  type: "text" | "group" | "h1" | "h2" | "h3" | "h4" | "timeline";
  content: string | { label: string; value: string };
  id: string;
  order: number;
  className?: string;
};

type DraftContextInput = {
  defaultUserData: UserResource;
  vacancy: Vacancy;
  user: any;
  children: (props: DraftContext) => JSX.Element;
};

type DraftContext = {
  downloadFired: boolean;
  setDownloadFired: (downloadFired: boolean) => void;
  leftComponents: Component[];
  rightComponents: Component[];
};

const getLs = (key: string, fallback: string) => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(key);
  }
  return fallback;
};

const Context = createContext({} as DraftContext);

export const useDraftContext = () => {
  const draft = useContext(Context);
  return draft;
};

export const DraftContext = (props: DraftContextInput) => {
  const { children, defaultUserData, vacancy, user } = props;
  const [downloadFired, setDownloadFired] = useState(false);

  const leftComponents = [
    {
      type: "h4",
      content: "General",
      id: "general",
    },
    {
      type: "group",
      content: {
        label: "Experience",
        value: vacancy.requiredYears || "3 years",
      },
      id: "group-experience",
    },
    {
      type: "group",
      content: {
        label: "Country",
        value: "USA",
      },
      id: "group-country",
    },
    {
      type: "h4",
      content: "Contact",
      id: "contact",
    },
    {
      type: "group",
      content: {
        label: "Email",
        value: defaultUserData.emailAddresses[0]?.emailAddress,
      },
      id: "group-email",
    },
    {
      type: "group",
      content: {
        label: "LinkedIn",
        value: "https://www.linkedin.com/in/alexander-ivanov-123456789/",
      },
      id: "group-linkedin",
    },
    {
      type: "group",
      content: {
        label: "Github",
        value: "https://www.linkedin.com/in/alexander-ivanov-123456789/",
      },
      id: "group-github",
    },
    {
      type: "group",
      content: {
        label: "Address",
        value: "Baker Street, 221B",
      },
      id: "group-address",
    },
    {
      type: "h4",
      content: "Education",
      id: "education",
    },
    {
      type: "text",
      content: "2016-2020",
      id: "education-duration",
    },
    {
      type: "text",
      content: "Master degree",
      id: "education-degree",
    },
    {
      type: "text",
      content: "MSU, Computer Science",
      id: "education-university",
    },
    {
      type: "h4",
      content: "Skills",
      id: "skills",
    },
    {
      type: "text",
      content: "React, Node.js, TypeScript, GraphQL, MongoDB, PostgreSQL",
      id: "skills-list",
    },
    {
      type: "h4",
      content: "Languages",
      id: "languages",
    },
    {
      type: "group",
      content: {
        label: "English",
        value: "C1",
      },
      id: "group-english",
    },
    {
      type: "group",
      content: {
        label: "Russian",
        value: "Native",
      },
      id: "group-russian",
    },
  ].map((c, order) => ({ ...c, order: order + 1 }));

  const rightComponents = [
    {
      type: "h1",
      content: defaultUserData.fullName,
      id: "name",
    },
    {
      type: "h3",
      content: vacancy.jobTitle,
      id: "job-title",
    },
    {
      type: "h4",
      content: "Experience",
      className: "text-[#323B4C] border-bottom mt-8",
      id: "experience",
    },
    {
      type: "timeline",
      props: {
        jobDescription: vacancy.description,
        jobTitle: vacancy.jobTitle,
        vacancyId: vacancy.id,
      },
      id: "timeline",
    },
  ].map((c, order) => ({ ...c, order: order + 1 }));

  const context = {
    downloadFired,
    setDownloadFired,
    leftComponents,
    rightComponents,
  };

  return (
    // @ts-ignore
    <Context.Provider value={context}>{children(context)}</Context.Provider>
  );
};
