import {
  CSSProperties,
  PropsWithChildren,
  createContext,
  useContext,
  useReducer,
  useState,
} from "react";
import type { UserResource } from "@clerk/types";
import type { User, Vacancy } from "@prisma/client";

import * as actions from "./actions";

export type DraftComponent = {
  id: string;
  order: number;
  type: "heading 1" | "heading 2" | "heading 3" | "text" | "group" | "timeline";
  sectionId: string;
  props: {
    name: string;
    value: string;
    label: string | null;
    className?: string;
    style?: CSSProperties;
  };
};

export type Sections = {
  [name: string]: {
    id: string;
    order: number;
    components: DraftComponent[];
    className: string;
  };
};

export type Design = {
  id: string;
  name: string;
  sections: Sections;
  components: {
    "heading 1": string;
    "heading 2": string;
    "heading 3": string;
    text: string;
    group: string;
  };
};

type DraftContextInput = PropsWithChildren<{
  defaultUserData: UserResource;
  vacancy: Vacancy;
  user: User;
}>;

type DraftState = Partial<Record<keyof typeof actions, boolean>>;
type Dispatchers = Record<
  "setDownloadFired" | "setRearrangeFired",
  (payload?: boolean) => void
>;

type DraftContext = {
  design: Design;
  updateDesign: (updateFn: (design: Design) => Design) => void;
  draftState: DraftState;
  dispatchers: Dispatchers;
  user: User;
  vacancy: Vacancy;
  defaultUserData: UserResource;
};

const initialArg = {
  [actions.DOWNLOAD_FIRED]: false,
  [actions.REARRANGING_FIRED]: false,
};

const reducer = (
  state: DraftState,
  action: {
    type: keyof typeof actions;
    payload?: boolean;
  }
): DraftState => {
  const { type, payload } = action;
  const newValue = typeof payload === "boolean" ? payload : !state[type];

  if (!actions[type]) return state;

  const newState = {};

  /**
   * Set all other actions to false.
   */
  Object.keys(state).forEach((key) => {
    if (key !== type) {
      newState[key] = false;
    } else {
      newState[key] = newValue;
    }
  });

  return newState;
};

const Context = createContext({} as DraftContext);

export const useDraftContext = () => {
  const draft = useContext(Context);
  return draft;
};

export const DraftContext = (props: DraftContextInput) => {
  const { children, defaultUserData, vacancy, user } = props;
  const [state, dispatch] = useReducer(reducer, initialArg);

  const leftHeading =
    "text-2xl tracking-[-0.029375rem] pb-[2%] border-b-[2px] border-solid border-current";

  const leftComponents = [
    {
      type: "heading 2",
      id: "general",
      props: {
        name: "general",
        value: "General",
        label: null,
        className: leftHeading,
      },
    },
    {
      type: "group",
      id: "group-experience",
      props: {
        name: "experience",
        value: user.ownExperienceYears || vacancy.requiredYears || "3 years",
        label: "Experience",
      },
    },
    {
      type: "group",
      id: "group-country",
      props: {
        name: "country",
        value: "USA",
        label: "Country",
      },
    },
    {
      type: "heading 2",
      id: "contact",
      props: {
        name: "contact",
        value: "Contact",
        label: null,
        className: leftHeading,
      },
    },
    {
      type: "group",
      id: "group-email",
      props: {
        name: "email",
        value: defaultUserData.emailAddresses[0]?.emailAddress,
        label: "Email",
      },
    },
    {
      type: "group",
      id: "group-linkedin",
      props: {
        name: "linkedin",
        value: "https://www.linkedin.com/in/alexander-ivanov-123456789/",
        label: "LinkedIn",
      },
    },
    {
      type: "group",
      id: "group-github",
      props: {
        name: "github",
        value: "https://www.linkedin.com/in/alexander-ivanov-123456789/",
        label: "Github",
      },
    },
    {
      type: "group",
      id: "group-address",
      props: {
        name: "address",
        value: "Baker Street, 221B",
        label: "Address",
      },
    },
    {
      type: "heading 2",
      id: "education",
      props: {
        name: "education",
        value: "Education",
        label: null,
        className: leftHeading,
      },
    },
    {
      type: "text",
      id: "education-duration",
      props: {
        name: "education-duration",
        value: "2016-2020",
        label: null,
      },
    },
    {
      type: "text",
      id: "education-degree",
      props: {
        name: "education-degree",
        value: "Master degree",
        label: null,
      },
    },
    {
      type: "text",
      id: "education-university",
      props: {
        name: "education-university",
        value: "MSU, Computer Science",
        label: null,
      },
    },
    {
      type: "heading 2",
      id: "skills",
      props: {
        name: "skills",
        value: "Skills",
        label: null,
        className: leftHeading,
      },
    },
    {
      type: "text",
      id: "skills-list",
      props: {
        name: "skills-list",
        value: "React, Node.js, TypeScript, GraphQL, MongoDB, PostgreSQL",
        label: null,
      },
    },
    {
      type: "heading 2",
      id: "languages",
      props: {
        name: "languages",
        value: "Languages",
        label: null,
        className: leftHeading,
      },
    },
    {
      type: "group",
      id: "group-english",
      props: {
        name: "english",
        value: "C1",
        label: "English",
      },
    },
    {
      type: "group",
      id: "group-russian",
      props: {
        name: "russian",
        value: "Native",
        label: "Russian",
      },
    },
  ].map((c, order) => ({
    ...c,
    order: order + 1,
    sectionId: "left",
  })) as DraftComponent[];

  const rightComponents = [
    {
      type: "heading 1",
      id: "name",
      props: {
        name: "name",
        value: defaultUserData.fullName,
        label: null,
      },
    },
    {
      type: "heading 3",
      id: "job-title",
      props: {
        name: "job-title",
        value: vacancy.jobTitle,
        label: null,
      },
    },
    {
      type: "heading 2",
      id: "experience",
      props: {
        name: "experience",
        value: "Experience",
        label: null,
      },
    },
  ].map((c, order) => ({
    ...c,
    order: order + 1,
  })) as DraftComponent[];

  const timeline = {
    type: "timeline",
    id: "timeline",
    props: {
      name: "timeline",
      jobDescription: vacancy.description,
      jobTitle: vacancy.jobTitle,
      vacancyId: vacancy.id,
    },
    order: 3,
  } as unknown as DraftComponent;

  const baseDesign = {
    id: vacancy.id,
    name: "Base design",
    sections: {
      left: {
        id: "left",
        order: 0,
        components: leftComponents,
        className:
          "flex h-full flex-col items-center bg-[#323B4C] px-5 py-7 clr-white",
      },
      right: {
        id: "right",
        order: 1,
        components: [...rightComponents, timeline],
        className: "bg-white px-[2rem] py-[3rem] clr-black",
      },
    },
    components: {
      "heading 1": "text-[50px] font-bold text-[#323B4C]",
      "heading 2":
        "text-[2rem] pb-[2%] my-[2%] border-current border-solid border-b-[2px] font-bold",
      "heading 3": "text-[1rem] mb-[2%]",
      text: "",
      group: "grid grid-cols-[1fr,170px]",
    },
  };

  const [design, setDesign] = useState<Design>(baseDesign);

  const updateDesign = (updateFn: (design: Design) => Design) => {
    setDesign((prev) => updateFn(prev));
  };

  const context: DraftContext = {
    draftState: state,
    dispatchers: {
      setDownloadFired: (payload) =>
        dispatch({ type: actions.DOWNLOAD_FIRED, payload }),
      setRearrangeFired: (payload) =>
        dispatch({ type: actions.REARRANGING_FIRED, payload }),
    },
    design,
    updateDesign,
    user,
    vacancy,
    defaultUserData,
  };

  return <Context.Provider value={context}>{children}</Context.Provider>;
};
