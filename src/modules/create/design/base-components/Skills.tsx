import { useEffect, useState } from "react";

import { DndProvider } from "./dnd/DndProvider";
import { useComponentContext } from "../contexts/ComponentContext";
import { useDesignContext } from "../contexts/DesignContext";
import { useCurrentDraft } from "~/hooks/useCurrentDraft";
import { parseSkills } from "~/modules/init-gen/parsers";
import { pick } from "lodash-es";
import { cn } from "~/utils";
import { GeneratedDraft } from "~/modules/init-gen/types";
import {
  SKILLS_UPDATED_BY_USER_EVENT,
  SKILLS_GENERATED_EVENT,
} from "~/modules/events";

const { log } = console;

type Data = ReturnType<typeof parseSkills>;
type SkillsUpdatedByUser = CustomEvent<GeneratedDraft["generatedSkills"]>;

export const Skills = () => {
  const { currentDraft } = useCurrentDraft();
  const { design } = useDesignContext();
  const c = useComponentContext();
  const [data, setData] = useState({} as Data);

  useEffect(() => {
    document.addEventListener(SKILLS_UPDATED_BY_USER_EVENT, (event) => {
      const newSkills = (event as SkillsUpdatedByUser).detail;

      setData((prev) => ({
        ...prev,
        generatedSkills: newSkills,
      }));
    });
  }, []);

  useEffect(() => {
    if (data.generatedSkills) return;

    const isExistingDraft =
      currentDraft && currentDraft.generatedSkills?.length !== 0;

    if (isExistingDraft) {
      setData(
        pick(currentDraft, [
          "generatedSkills",
          "vacancySkills",
          "vacancyResponsibilities",
          "generatedProfessionalSummary",
        ])
      );

      return;
    }

    const onSkillsGenerated = (event: Event) => {
      const customEvent = event as CustomEvent<Data>;
      const eventData = customEvent.detail;
      setData(eventData);
    };

    document.addEventListener(SKILLS_GENERATED_EVENT, onSkillsGenerated);

    // Cleanup: Remove the event listener
    return () => {
      document.removeEventListener(SKILLS_GENERATED_EVENT, onSkillsGenerated);
    };
  }, [currentDraft]);

  if (!data.generatedSkills || !currentDraft)
    return (
      <div className="flex-y flex-wrap gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-[30px] w-[50px] animate-pulse rounded-md bg-grayD"
          />
        ))}
      </div>
    );

  const providerProps = {
    className: cn(design.baseComponents?.skills?.className, "skills-section"),
    /**
     * Always passed for the `DndProvider` component.
     */
    ...c.hydratableProps!({
      ...currentDraft,
      generatedSkills: data.generatedSkills,
    }),
  };

  return <DndProvider {...providerProps} />;
};
