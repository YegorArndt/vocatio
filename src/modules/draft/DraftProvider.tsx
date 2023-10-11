import {
  useReducer,
  type PropsWithChildren,
  type ChangeEvent,
  createContext,
  useContext,
} from "react";

import type { Inputs } from "~/types/utils";
import type {
  Action,
  DraftContextInput,
  DraftContextOutput,
  DraftState,
} from "./types";
import {
  writeToLocalStorage,
  tabAutocomplete,
  readFromLocalStorage,
  restoreToDefaults,
} from "./utils";
import { REARRANGING_FIRED, RESTORE_TO_DEFAULTS_FIRED } from "./actions";

export const DraftContext = createContext<DraftContextOutput>(
  {} as DraftContextOutput
);

export const useDraftContext = () => {
  const draft = useContext(DraftContext);
  return draft;
};

const reducer = (state: DraftState, action: Action) => {
  switch (action.type) {
    // case REARRANGING_FIRED:
    // case DOWNLOAD_FIRED:
    // case SAVE_FIRED:
    // case DELETE_FIRED:
    // case RESTORE_TO_DEFAULTS_FIRED: {
    //   return {
    //     ...state,
    //     ...action.payload,
    //   };
    // }
    case REARRANGING_FIRED: {
      const { isRearranging } = action.payload;

      return {
        ...state,
        isRearranging,
      };
    }
    case RESTORE_TO_DEFAULTS_FIRED: {
      restoreToDefaults(state.vacancyId);
    }
    default:
      return state;
  }
};

export const DraftProvider = (props: PropsWithChildren<DraftContextInput>) => {
  const { children, initialDraft, rawData } = props;
  const { vacancyId } = initialDraft;

  const [state, dispatch] = useReducer(reducer, {
    vacancyId,
    isRearranging: false,
  });

  const onChange = (e: ChangeEvent<Inputs>) => {
    const { name, value, dataset } = e.target;

    // const { action } = dataset;

    /**
     * Here keep track of ClientFile object
     */
    writeToLocalStorage(vacancyId, name, value);
  };

  const register = (name: string) => {
    const properties = {
      onChange,
      onKeyDown: (e) => tabAutocomplete(e, vacancyId),
    };

    return properties;
  };

  return (
    <DraftContext.Provider
      value={{
        register,
        getDefaultValue: readFromLocalStorage(vacancyId),
        getPlaceholder: readFromLocalStorage(vacancyId),
        rawData,
        state,
        dispatch,
      }}
    >
      {children}
    </DraftContext.Provider>
  );
};
