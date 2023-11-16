import { createContext, useContext, useReducer, useState } from "react";
import type {
  DraftState,
  DraftContextInput,
  Design,
  DraftContext as DraftContextType,
  NewComponent,
  DraftComponent,
  TypeOfComponent,
} from "./types";
import * as actions from "./actions";
import {
  addNewComponent,
  getEditableDesign,
  changeComponentType as changeType,
  toggleClassName as toggleCn,
} from "./utils";
import { Venusaur } from "./designs/Venusaur";

const initialArg = {
  [actions.DOWNLOAD_FIRED]: false,
  [actions.CHANGE_DESIGN_FIRED]: false,
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

  const fields = {
    "user-name": user.ownName || defaultUserData.fullName,
    "job-title": user.ownJobTitle || vacancy.jobTitle,
    objective: user.ownObjective,
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
  };

  const toEditableDesign = (design: Design) => {
    return getEditableDesign({
      design,
      fields,
      vacancyId: vacancy.id,
      jobDescription: vacancy.description || "",
      jobTitle: vacancy.jobTitle || user.ownJobTitle || "",
    });
  };

  const initialDesign = toEditableDesign(Venusaur);

  const [design, setDesign] = useState<Design>(initialDesign);

  const updateDesign = (updateFn: (design: Design) => Design) => {
    setDesign((prev) => updateFn(prev));
  };

  const changeDesign = (design: Design) => setDesign(toEditableDesign(design));

  const addComponent = (nc: NewComponent, clickedComponent: DraftComponent) =>
    setDesign((prev) => addNewComponent(prev, nc, clickedComponent));

  const toggleClassName = (component: DraftComponent, className: string) =>
    setDesign((prev) => toggleCn(prev, component, className));

  const changeComponentType = (
    componentToChange: DraftComponent,
    newType: TypeOfComponent
  ) => setDesign((prev) => changeType(prev, componentToChange, newType));

  const context: DraftContextType = {
    draftState: state,
    dispatchers: {
      setDownloadFired: (payload) =>
        dispatch({ type: actions.DOWNLOAD_FIRED, payload }),
      setChangeDesignFired: (payload) =>
        dispatch({ type: actions.CHANGE_DESIGN_FIRED, payload }),
    },
    design,
    updateDesign,
    addComponent,
    toggleClassName,
    changeComponentType,
    changeDesign,
    user,
    vacancy,
    defaultUserData,
  };

  return (
    <Context.Provider value={context}>
      {children(design.a4, Boolean(state.CHANGE_DESIGN_FIRED))}
    </Context.Provider>
  );
};
