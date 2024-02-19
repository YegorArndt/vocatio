import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { getLsGeneratedData, setLsGeneratedData } from "~/utils/ls";
import type { GeneratedData } from "~/modules/init-gen/types";
import { GENERATED_DATA_UPDATED } from "~/modules/events";

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

    document.dispatchEvent(
      new CustomEvent(GENERATED_DATA_UPDATED, { detail: gen })
    );
  };

  useEffect(() => {
    document.addEventListener(GENERATED_DATA_UPDATED, (e) => {
      setGenerated((e as CustomEvent<GeneratedData>).detail);
    });

    return () => {
      document.removeEventListener(GENERATED_DATA_UPDATED, (e) => {
        setGenerated((e as CustomEvent<GeneratedData>).detail);
      });
    };
  }, []);

  if (!generated) return {};

  return {
    generated,
    updateGeneratedData,
  };
};
