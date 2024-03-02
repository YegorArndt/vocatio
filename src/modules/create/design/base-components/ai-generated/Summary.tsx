import { Events, PopoverEvents } from "~/modules/events/types";
import { useComponentContext } from "../../contexts/ComponentContext";
import { useDesignContext } from "../../contexts/DesignContext";
import { Autoresize } from "../Autoresize";
import { useEffect, useState } from "react";
import { useEvents } from "~/hooks/useEvents";
import { CvContextManager } from "~/modules/CvContextManager";
import { getSettings } from "~/modules/settings/settings";

const { log } = console;

const PROFESSIONAL_SUMMARY_CN = "text-[12px]";

export const Summary = () => {
  const { design } = useDesignContext();
  const c = useComponentContext();
  const [summary, setSummary] = useState("");

  const handler = () => {
    if (summary !== "") return;
    let generatedSummary = CvContextManager.getInstance().getCv()?.summary;
    const settings = getSettings();
    generatedSummary = settings[PopoverEvents.BOLDEN_SUMMARY]
      ? generatedSummary
      : generatedSummary?.replaceAll("font-bold", "");
    if (generatedSummary) setSummary(generatedSummary);
  };

  useEffect(handler, []);

  useEvents({
    [Events.GEN_UPDATED]: handler,
    [PopoverEvents.BOLDEN_SUMMARY]: handler,
  });

  if (summary === "")
    return (
      <section className="flex flex-col gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-[10px] w-full animate-pulse rounded-md bg-grayD"
          />
        ))}
      </section>
    );

  const professionalSummary = {
    className:
      design.baseComponents?.professionalSummary?.className ??
      PROFESSIONAL_SUMMARY_CN,
    value: summary,
    ...c.hydratedProps,
  };

  return <Autoresize {...professionalSummary} />;
};
