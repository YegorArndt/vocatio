import { GENERATED_DATA_UPDATED } from "~/modules/events";
import { useComponentContext } from "../contexts/ComponentContext";
import { useDesignContext } from "../contexts/DesignContext";
import { Autoresize } from "./Autoresize";
import { useEffect, useState } from "react";
import { useGeneratedData } from "~/hooks/useGeneratedData";

const { log } = console;

type SummaryGeneratedEvent = CustomEvent<{
  generatedProfessionalSummary: string;
}>;

const PROFESSIONAL_SUMMARY_CN = "text-[12px]";

export const ProfessionalSummary = () => {
  const { design } = useDesignContext();
  const c = useComponentContext();
  const [summary, setSummary] = useState("");
  const { generated } = useGeneratedData();

  useEffect(() => {
    if (!generated || summary) return;
    const { generatedProfessionalSummary } = generated;

    setSummary(generatedProfessionalSummary);
  }, [generated]);

  useEffect(() => {
    const onSummaryGenerated = (event: Event) => {
      const { generatedProfessionalSummary } = (event as SummaryGeneratedEvent)
        .detail;

      setSummary(generatedProfessionalSummary);
    };

    document.addEventListener(GENERATED_DATA_UPDATED, onSummaryGenerated);

    return () => {
      document.removeEventListener(GENERATED_DATA_UPDATED, onSummaryGenerated);
    };
  }, []);

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
