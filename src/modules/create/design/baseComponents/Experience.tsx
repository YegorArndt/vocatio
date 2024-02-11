import { DndProvider } from "./dnd/DndProvider";
import { useComponentContext } from "../contexts/ComponentContext";
import { useDesignContext } from "../contexts/DesignContext";
import { useCurrentDraft } from "~/hooks/useCurrentDraft";
import { BigEntrySkeleton } from "./BigEntrySkeleton";
import { useState, useEffect } from "react";

import { cn } from "~/utils";
import type { GeneratedExperience } from "~/modules/init-gen/types";
import {
  EXPERIENCE_GENERATED_EVENT,
  EXPERIENCE_ENTRY_ADDED_BY_USER_EVENT,
  ADD_BULLET_TO_ENTRY_EVENT,
} from "~/modules/constants";
import { take } from "lodash-es";

const { log } = console;

type AddBulletToEntryEvent = CustomEvent<{
  bullet: string;
  entryId: string;
}>;

type AddNewExperienceEntryEvent = CustomEvent<GeneratedExperience>;

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
    const onEntryAdded = (event: Event) => {
      const newEntries = (event as AddNewExperienceEntryEvent).detail;
      setData(newEntries);
    };
    const onBulletAdded = (event: Event) => {
      const { bullet, entryId } = (event as AddBulletToEntryEvent).detail;

      setData((prev) =>
        prev.map((entry) => {
          if (entry.id === entryId) {
            return {
              ...entry,
              generatedDescription: [...entry.generatedDescription, bullet],
            };
          }

          return entry;
        })
      );
    };

    document.addEventListener(
      EXPERIENCE_ENTRY_ADDED_BY_USER_EVENT,
      onEntryAdded
    );
    document.addEventListener(ADD_BULLET_TO_ENTRY_EVENT, onBulletAdded);

    return () => {
      document.removeEventListener(
        EXPERIENCE_ENTRY_ADDED_BY_USER_EVENT,
        onEntryAdded
      );
      document.removeEventListener(ADD_BULLET_TO_ENTRY_EVENT, onBulletAdded);
    };
  }, [currentDraft]);

  useEffect(() => {
    if (data.length !== 0) return;

    if (currentDraft && currentDraft?.generatedExperience?.length) {
      setData(currentDraft.generatedExperience);
      return;
    }

    const onExperienceGenerated = (event: Event) => {
      const customEvent = event as CustomEvent<GeneratedExperience>;
      const eventData = customEvent.detail;
      const limitedData = limitTo3Bullets(eventData);

      setData(limitedData);
    };

    document.addEventListener(
      EXPERIENCE_GENERATED_EVENT,
      onExperienceGenerated
    );

    // Cleanup: Remove the event listener
    return () => {
      document.removeEventListener(
        EXPERIENCE_GENERATED_EVENT,
        onExperienceGenerated
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
