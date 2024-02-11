import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { getDraftByVacancyId, setDraftByVacancyId } from "~/utils/ls";
import type { GeneratedDraft } from "~/modules/init-gen/types";

export const useCurrentDraft = () => {
  const [currentDraft, setCurrentDraft] = useState({} as GeneratedDraft);
  const router = useRouter();

  useEffect(() => {
    if (currentDraft.id) return;

    // @ts-ignore
    const draft = getDraftByVacancyId(router.query.vacancyId);
    if (draft) setCurrentDraft(draft);
  }, [router?.query]);

  const updateDraft = (draft: GeneratedDraft) => {
    setCurrentDraft(draft);
    setDraftByVacancyId(draft.vacancy.id, draft);
  };

  if (!currentDraft) return {};

  return {
    currentDraft,
    updateDraft,
  };
};
