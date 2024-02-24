import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { getLsGeneratedData, setLsGeneratedData } from "~/utils/ls";
import type { GeneratedData } from "~/modules/init-gen/types";
import { Events, eventManager } from "~/modules/EventManager";

const { log } = console;

export const useGeneratedData = () => {
  const [generated, setGenerated] = useState<GeneratedData | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (generated?.id) return;

    // @ts-ignore
    const gen = getLsGeneratedData(router.query.vacancyId);
    if (gen) setGenerated(gen);
  }, [router?.query]);

  const updateGeneratedData = (gen: GeneratedData) => {
    setGenerated(gen);
    setLsGeneratedData(gen);

    eventManager.emit(Events.GENERATED_DATA_UPDATED, gen);
  };

  useEffect(() => {
    eventManager.on<GeneratedData>(Events.GENERATED_DATA_UPDATED, (e) => {
      setGenerated(e.detail);
    });

    return () => {
      eventManager.off<GeneratedData>(Events.GENERATED_DATA_UPDATED, (e) => {
        setGenerated(e.detail);
      });
    };
  }, []);

  if (!generated) return {};

  return {
    generated,
    updateGeneratedData,
  };
};
