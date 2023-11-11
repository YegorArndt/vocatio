import { createContext, useContext, useReducer, useState } from "react";
import type {
  DraftState,
  DraftContextInput,
  DraftComponent,
  Design,
  DraftContext as DraftContextType,
  NewComponent,
} from "./types";
import * as actions from "./actions";
import { addNewComponent } from "./utils";

const initialArg = {
  [actions.DOWNLOAD_FIRED]: false,
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

  const newState = { ...state };

  /**
   * Set all other actions to false.
   */
  Object.keys(state).forEach((key) => {
    if (key !== type) newState[key as keyof typeof actions] = false;
    else newState[key] = newValue;
  });

  return newState;
};

const Context = createContext({} as DraftContextType);

export const useDraftContext = () => {
  const draft = useContext(Context);
  return draft;
};

export const DraftContext = (props: DraftContextInput) => {
  const { children, defaultUserData, vacancy, user } = props;
  const [state, dispatch] = useReducer(reducer, initialArg);

  const leftComponents = [
    {
      type: "heading 2",
      id: "general",
      props: {
        name: "general",
        value: "General",
        label: "",
      },
    },
    {
      type: "divider",
      id: "general-divider",
      props: {
        name: "general",
        value: "General",
        label: "",
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
        label: "",
      },
    },
    {
      type: "divider",
      id: "contact-divider",
      props: {
        name: "general",
        value: "General",
        label: "",
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
        label: "",
      },
    },
    {
      type: "divider",
      id: "education-divider",
      props: {
        name: "general",
        value: "General",
        label: "",
      },
    },
    {
      type: "text",
      id: "education-duration",
      props: {
        name: "education-duration",
        value: "2016-2020",
        label: "",
      },
    },
    {
      type: "text",
      id: "education-degree",
      props: {
        name: "education-degree",
        value: "Master degree",
        label: "",
      },
    },
    {
      type: "text",
      id: "education-university",
      props: {
        name: "education-university",
        value: "MSU, Computer Science",
        label: "",
      },
    },
    {
      type: "heading 2",
      id: "skills",
      props: {
        name: "skills",
        value: "Skills",
        label: "",
      },
    },
    {
      type: "divider",
      id: "skills-divider",
      props: {
        name: "general",
        value: "General",
        label: "",
      },
    },
    {
      type: "text",
      id: "skills-list",
      props: {
        name: "skills-list",
        value: "React, Node.js, TypeScript, GraphQL, MongoDB, PostgreSQL",
        label: "",
      },
    },
    {
      type: "heading 2",
      id: "languages",
      props: {
        name: "languages",
        value: "Languages",
        label: "",
      },
    },
    {
      type: "divider",
      id: "languages-divider",
      props: {
        name: "general",
        value: "General",
        label: "",
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
        label: "",
      },
    },
    {
      type: "heading 3",
      id: `job-title-${vacancy.id}`,
      props: {
        name: `job-title-${vacancy.id}`,
        value: vacancy.jobTitle,
        label: "",
      },
    },
    {
      type: "heading 2",
      id: "experience",
      props: {
        name: "experience",
        value: "Experience",
        label: "",
      },
    },
    {
      type: "divider",
      id: "experience-divider",
      props: {
        name: "general",
        value: "General",
        label: "",
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
      "heading 2": "text-[2rem] tracking-[-0.029375rem] font-bold mt-2",
      "heading 3": "text-[1rem] mb-[2%]",
      text: "",
      group: "grid grid-cols-[100px,160px] gap-2",
      timeline: "",
      divider: "border-current border-solid border-b-[2px] mb-2",
    },
  };

  const [design, setDesign] = useState<Design>(baseDesign);

  const updateDesign = (updateFn: (design: Design) => Design) => {
    setDesign((prev) => updateFn(prev));
  };

  const addComponent = (component: NewComponent) =>
    setDesign((prev) => addNewComponent(prev, component));

  const context: DraftContextType = {
    draftState: state,
    dispatchers: {
      setDownloadFired: (payload) =>
        dispatch({ type: actions.DOWNLOAD_FIRED, payload }),
    },
    design,
    updateDesign,
    addComponent,
    user,
    vacancy,
    defaultUserData,
  };

  return <Context.Provider value={context}>{children}</Context.Provider>;
};
