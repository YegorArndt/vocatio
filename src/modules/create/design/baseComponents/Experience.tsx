import { DndProvider } from "./DndProvider";
import { useComponentContext } from "../contexts/ComponentContext";
import { useDesignContext } from "../contexts/DesignContext";
import { useCurrentDraft } from "~/hooks/useCurrentDraft";
import { BigEntrySkeleton } from "./BigEntrySkeleton";
import { GeneratedDraft } from "../types";
import { useState, useEffect } from "react";
import {
  EXPERIENCE_READY_EVENT,
  EXPERIENCE_UPDATED_EVENT,
} from "~/modules/init-gen/constants";
import { cn } from "~/utils";
import { take } from "lodash-es";

const { log } = console;

type GeneratedExperience = GeneratedDraft["generatedExperience"];

type ExperienceUpdatedEvent = CustomEvent<{
  newExperience: GeneratedExperience;
}>;

const limitTo3Bullets = (experience: GeneratedExperience) => {
  return experience.map((entry) => {
    const { generatedDescription } = entry;
    const shouldLimit = generatedDescription.length > 3;

    return {
      ...entry,
      generatedDescription: take(
        generatedDescription,
        shouldLimit ? 3 : undefined
      ),
    };
  });
};

export const Experience = () => {
  const { currentDraft } = useCurrentDraft();
  const { design } = useDesignContext();
  const c = useComponentContext();

  const [data, setData] = useState([] as GeneratedExperience);

  useEffect(() => {
    document.addEventListener(EXPERIENCE_UPDATED_EVENT, (event) => {
      const { newExperience } = (event as ExperienceUpdatedEvent).detail;
      setData(newExperience);
    });
  }, []);

  useEffect(() => {
    if (data.length !== 0) return;

    if (currentDraft && currentDraft?.generatedExperience?.length) {
      setData(currentDraft.generatedExperience);
      return;
    }

    const handleExperienceReady = (event: Event) => {
      const customEvent = event as CustomEvent<GeneratedExperience>;
      const eventData = customEvent.detail;
      const limitedData = limitTo3Bullets(eventData);

      setData(limitedData);
    };

    document.addEventListener(EXPERIENCE_READY_EVENT, handleExperienceReady);

    // Cleanup: Remove the event listener
    return () => {
      document.removeEventListener(
        EXPERIENCE_READY_EVENT,
        handleExperienceReady
      );
    };
  }, [currentDraft]);

  if (data.length === 0 || !currentDraft) return <BigEntrySkeleton />;

  const providerProps = {
    className: cn(design.baseComponents?.experience?.className, "cv-section"),
    /**
     * Always passed for the `DndProvider` component.
     */
    ...c.hydratableProps!({ ...currentDraft, generatedExperience: data }),
  };

  return <DndProvider {...providerProps} />;
};
