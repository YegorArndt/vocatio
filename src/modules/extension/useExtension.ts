import { useState, useEffect } from "react";

import { endpoint } from "./constants";
import type { Vacancy } from "./types";

export const useExtension = () => {
  const [data, setData] = useState<Vacancy | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await (await fetch(endpoint)).json();
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
