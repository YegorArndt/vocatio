import { createContext, useContext, useReducer, useState } from "react";

import * as actions from "./actions";
import { Venusaur } from "./designs/Venusaur";
import { DraftComponent, TypeOfComponent } from "./types/components";
import type {
  DraftState,
  DraftContextInput,
  Design,
  NewComponent,
  DraftContext as DraftContextType,
} from "./types/processed";
import type { RawDesign } from "./types/raw";
import { getDefaults } from "./utils/common";
import { getProcessedDesign } from "./utils/getProcessedDesign";
import {
  addNewComponent,
  changeComponentType,
  removeComponent,
  toggleCn,
} from "./utils/tooltip";

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

  const defaults = getDefaults(user, defaultUserData, vacancy);
  const jobTitle = vacancy.jobTitle || user.ownJobTitle || "";
  const jobDescription = vacancy.description || "";

  const processDesign = (d: RawDesign | Design) =>
    getProcessedDesign(defaults, d, vacancy.id, jobTitle, jobDescription);

  const initialDesign = processDesign(Venusaur);

  const [design, setDesign] = useState<Design>(initialDesign);

  const updateDesign = (updateFn: (d: Design) => Design) => {
    setDesign((d) => updateFn(d));
  };

  const changeDesign = (d: RawDesign | Design) => setDesign(processDesign(d));

  const add = (nc: NewComponent, clickedComponent: DraftComponent) =>
    setDesign((d) => addNewComponent(d, nc, clickedComponent));

  const remove = (c: DraftComponent) => setDesign((d) => removeComponent(d, c));

  const toggleClassName = (c: DraftComponent, className: string) =>
    setDesign((d) => toggleCn(d, c, className));

  const changeType = (c: DraftComponent, newType: TypeOfComponent) =>
    setDesign((d) => changeComponentType(d, c, newType));

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
    add,
    remove,
    toggleClassName,
    changeType,
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
