import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export const useVacancyId = () => {
  const [vacancyId, setVacancyId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const id = router.query.vacancyId as string;
    if (id) setVacancyId(id);
  }, [router?.query]);

  return vacancyId;
};
