import { useEffect, useState } from "react";
import { CvContextManager } from "~/modules/CvContextManager";
import { Cv, Gen } from "~/modules/init-gen/types";
import { PartialVacancy } from "~/modules/types";
import { useEvents } from "./useEvents";
import { Events } from "~/modules/events/types";

const { log } = console;

type CvContext = {
  cv: Cv;
  gen: Gen;
  vacancy: PartialVacancy;
};

/**
 * Workaround for Next.js SSR to access LS via class.
 */
export const useCvContext = () => {
  const [x, setX] = useState<CvContext | null>(null);

  const setState = () => {
    const instance = CvContextManager.getInstance();

    const context = {
      gen: instance.getGen(),
      cv: instance.getCv(),
      vacancy: instance.getVacancy(),
    } as CvContext;

    setX(context);
  };

  useEffect(() => {
    setState();
  }, []);

  useEvents({
    [Events.GEN_UPDATED]: setState,
  });

  return x;
};
