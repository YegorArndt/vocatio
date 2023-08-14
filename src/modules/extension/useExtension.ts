import { useState, useEffect } from "react";

import { endpoint } from "./constants";
import { getVacancy } from "./utils";
import type { RawVacancy, Vacancy } from "./types";

export const useExtension = () => {
  const [data, setData] = useState<Vacancy | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await (await fetch(endpoint)).json();
        const rawVacancy = JSON.parse(response.rawVacancy) as RawVacancy;
        const vacancy = getVacancy(rawVacancy);
        setData(vacancy);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(err as Error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, isLoading, error };
};
