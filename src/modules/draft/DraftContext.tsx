import { createContext, useContext, useReducer, useState } from "react";

import * as actions from "./actions";
import { Venusaur } from "./designs/Venusaur";
import type {
  NormalizedComponent,
  RawComponent,
  TypeOfComponent,
} from "./types/components";
import type {
  DraftState,
  DraftContextInput,
  DraftContext as DraftContextType,
} from "./types";
import { getDefaults } from "./utils/getDefaults";
import { RawDesign, Design } from "./types/design";
import { init } from "./utils/init";
import { remove, add, toggle, changeType } from "./utils/component-toolbar";
import { rotateSectionByTitle } from "./utils/component-toolbar/rotate";

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

  // Set all other actions to false.
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

  const initDesign = (d: RawDesign) =>
    init(defaults, d, vacancy.id, jobTitle, jobDescription);

  const initialDesign = initDesign(Venusaur);

  const [design, setDesign] = useState<Design>(initialDesign);

  const updateDesign = (updateFn: (d: Design) => Design) => {
    setDesign((d) => updateFn(d));
  };

  const changeDesign = (d: RawDesign) => setDesign(initDesign(d));

  const addNewComponent = (
    nc: RawComponent,
    clickedComponent: NormalizedComponent
  ) => setDesign((d) => add(d, vacancy.id, defaults, nc, clickedComponent));

  const removeComponent = (c: NormalizedComponent) =>
    setDesign((d) => remove(d, c, vacancy.id));

  const toggleClassName = (c: NormalizedComponent, className: string) =>
    setDesign((d) => toggle(d, c, className));

  const changeComponentType = (
    c: NormalizedComponent,
    newType: TypeOfComponent
  ) => setDesign((d) => changeType(d, c, newType));

  const rotate = (heading: NormalizedComponent, index: number) => {
    setDesign((d) =>
      rotateSectionByTitle(
        d,
        heading.sectionId,
        heading.props.value as string,
        index
      )
    );
  };

  console.log(design);

  const context: DraftContextType = {
    draftState: state,
    dispatchers: {
      setDownloadFired: (payload) =>
        dispatch({ type: actions.DOWNLOAD_FIRED, payload }),
      setChangeDesignFired: (payload) =>
        dispatch({ type: actions.CHANGE_DESIGN_FIRED, payload }),
    },
    rotate,
    design,
    updateDesign,
    addNewComponent,
    removeComponent,
    toggleClassName,
    changeComponentType,
    changeDesign,
    user,
    vacancy,
    defaultUserData,
    defaults,
  };

  return (
    <Context.Provider value={context}>{children(context)}</Context.Provider>
  );
};
