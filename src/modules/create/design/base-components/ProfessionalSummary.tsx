import { SKILLS_GENERATED_EVENT } from "~/modules/events";
import { useComponentContext } from "../contexts/ComponentContext";
import { useDesignContext } from "../contexts/DesignContext";
import { Autoresize } from "./Autoresize";
import { useEffect, useState } from "react";
import { useCurrentDraft } from "~/hooks/useCurrentDraft";

const { log } = console;

type SummaryGeneratedEvent = CustomEvent<{
  generatedProfessionalSummary: string;
}>;

const PROFESSIONAL_SUMMARY_CN = "text-[12px]";

export const ProfessionalSummary = () => {
  const { design } = useDesignContext();
  const c = useComponentContext();
  const [summary, setSummary] = useState("");
  const { currentDraft } = useCurrentDraft();

  useEffect(() => {
    if (currentDraft?.generatedProfessionalSummary) {
      setSummary(currentDraft.generatedProfessionalSummary);
      return;
    }

    const onSkillsGenerated = (event: Event) => {
      const { generatedProfessionalSummary } = (event as SummaryGeneratedEvent)
        .detail;

      setSummary(generatedProfessionalSummary);
    };

    document.addEventListener(SKILLS_GENERATED_EVENT, onSkillsGenerated);

    return () => {
      document.removeEventListener(SKILLS_GENERATED_EVENT, onSkillsGenerated);
    };
  }, [currentDraft]);

  if (summary === "" || !currentDraft?.vacancySkills)
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
