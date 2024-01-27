import { createContext, useContext, useState } from "react";
import { get } from "lodash-es";

import type { DraftContextInput, DraftContextOutput } from "./types";
import type { Design } from "./types/design";
import type { RawDesign } from "./types/raw";
import { Venusaur } from "./designs/Venusaur";
import { init } from "./utils/init";

const { log } = console;

/**
 * Utilize React's internal props to get the dynamic data structure of the current design.
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

  return sections;
};

const Context = createContext({} as DraftContextOutput);

export const useDraftContext = () => {
  const draft = useContext(Context);
  return draft;
};

export const DraftContext = (props: DraftContextInput) => {
  const { draft, children, a4Ref } = props;

  const hydrateDesign = (d: RawDesign) => init(draft, d);
  const initialDesign = hydrateDesign(Venusaur);

  const [design, setDesign] = useState<Design>(initialDesign);

  const updateDesign = (newDesign?: Partial<Design>) => {
    const isTemplateChanged = newDesign?.name && design.name !== newDesign.name;
    if (isTemplateChanged) return;

    // @ts-ignore
    setDesign((oldDesign) => {
      const newD = {
        ...oldDesign,
        sections: updateSections(a4Ref),
        ...newDesign,
      };

      return newD;
    });
  };

  const changeDesign = (d: RawDesign) => setDesign(hydrateDesign(d));

  const context: DraftContextOutput = {
    a4Ref,
    design,
    updateDesign,
    changeDesign,
    draft,
  };

  return (
    <Context.Provider value={context}>{children(context)}</Context.Provider>
  );
};
