import { useComponentContext } from "../contexts/ComponentContext";
import { useDesignContext } from "../contexts/DesignContext";
import { Autoresize } from "./Autoresize";
import { useEffect, useState } from "react";
import { instruct, hfFormat, cleanAiOutput } from "~/server/api/utils/ai";
import { useCurrentDraft } from "~/hooks/useCurrentDraft";
import { toast } from "sonner";

const { log } = console;

const PROFESSIONAL_SUMMARY_CN = "text-[12px]";

const prompt = `Create a perfect professional summary to include in a CV for the following vacancy. In the created summary wrap every hard skill (like "Node.js", "React", etc) in <span class="font-bold">{occurrence}</span> html tags.`;

const useSummary = () => {
  const [summary, setSummary] = useState("");
  const { currentDraft, updateDraft } = useCurrentDraft();

  useEffect(() => {
    if (!currentDraft?.id || summary) return;

    const shouldGenerate = currentDraft.generatedProfessionalSummary === "";

    if (!shouldGenerate) {
      setSummary(currentDraft.generatedProfessionalSummary);
      return;
    }

    const id = toast.loading("Generating professional summary...");

    instruct(
      `<s>[INST] ${prompt} ${
        currentDraft!.vacancy.description
      } ${hfFormat}.[/INST]</s>`,
      {
        max_new_tokens: 1000,
      }
    ).then((res): void => {
      const { generated_text } = res;
      const patterns = [
        currentDraft.vacancy.description!,
        /\[INST\](.*?)\[\/INST\]/s,
      ];
      const summary = cleanAiOutput(generated_text, patterns).replace(
        /\r?\n[\s\S]*/,
        ""
      );

      updateDraft!({ ...currentDraft, generatedProfessionalSummary: summary });
      setSummary(summary);

      toast.dismiss(id);
    });
  }, [currentDraft]);

  return { summary };
};

export const ProfessionalSummary = () => {
  const { design } = useDesignContext();
  const c = useComponentContext();
  const { summary } = useSummary();

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
