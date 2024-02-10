import { useEffect, useState } from "react";

import { DndProvider } from "./DndProvider";
import { useComponentContext } from "../contexts/ComponentContext";
import { useDesignContext } from "../contexts/DesignContext";
import { useCurrentDraft } from "~/hooks/useCurrentDraft";
import {
  SKILLS_READY_EVENT,
  SKILLS_UPDATED_EVENT,
} from "~/modules/init-gen/constants";
import { parseSkills } from "~/modules/init-gen/parsers";
import { pick } from "lodash-es";
import { cn } from "~/utils";
import { GeneratedDraft } from "../types";

const { log } = console;

type Data = ReturnType<typeof parseSkills>;

export const Skills = () => {
  const { currentDraft } = useCurrentDraft();
  const { design } = useDesignContext();
  const c = useComponentContext();
  const [data, setData] = useState({} as Data);

  useEffect(() => {
    document.addEventListener(SKILLS_UPDATED_EVENT, (event) => {
      const { newSkills } = (
        event as CustomEvent<{ newSkills: GeneratedDraft["generatedSkills"] }>
      ).detail;

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
        ])
      );

      return;
    }

    const handleSkillsReady = (event: Event) => {
      const customEvent = event as CustomEvent<Data>;
      const eventData = customEvent.detail;
      setData(eventData);
    };

    document.addEventListener(SKILLS_READY_EVENT, handleSkillsReady);

    // Cleanup: Remove the event listener
    return () => {
      document.removeEventListener(SKILLS_READY_EVENT, handleSkillsReady);
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
    className: cn(design.baseComponents?.skills?.className, "cv-section"),
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
