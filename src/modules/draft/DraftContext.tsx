import { createContext, useContext, useState } from "react";

import { Venusaur } from "./designs/Venusaur";
import type { DraftContextInput, DraftContextOutput } from "./types";
import type { RawDesign, Design } from "./types/design";
import { init } from "./utils/init";
import { getDefaults } from "./utils/getDefaults";
import { get } from "lodash-es";
import { Sections } from "./types/sections";

const { log } = console;

/**
 * Utilize React's internal props to get the SOTA of the current design.
 */
const updateSections = (a4Ref: DraftContextInput["a4Ref"]) => {
  const a4 = a4Ref.current;
  if (!a4) return;

  let id = null; // __reactProps$<id>

  for (let i = 0, keys = Object.keys(a4); i < keys.length; i++) {
    if ((id = keys[i]?.match(/^__reactProps[^$]*(\$.+)$/))) {
      id = `__reactProps${id[1]}`;
      break;
    }
  }

  if (!id) return;

  const { sections } = get(a4Ref.current, `${id}.children.props`, {
    sections: [],
  });

  return sections as Sections;
};

const Context = createContext({} as DraftContextOutput);

export const useDraftContext = () => {
  const draft = useContext(Context);
  return draft;
};

export const DraftContext = (props: DraftContextInput) => {
  const { children, defaultUserData, vacancy, user, a4Ref } = props;

  const defaults = getDefaults(user, defaultUserData, vacancy);
  const initDesign = (d: RawDesign) => init(defaults, d, vacancy.id);
  const initialDesign = initDesign(Venusaur);

  const [design, setDesign] = useState<Design>(initialDesign);

  const updateDesign = (newDesign?: Partial<Design>) =>
    setDesign((d) => ({
      ...d,
      sections: updateSections(a4Ref)!,
      ...newDesign,
    }));

  const persistToLs = (d: Design) => {
    localStorage.setItem(`cv-${vacancy.id}`, JSON.stringify(d));
  };

  const changeDesign = (d: RawDesign) => setDesign(initDesign(d));

  const context: DraftContextOutput = {
    a4Ref,
    design,
    updateDesign,
    persistToLs,
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
