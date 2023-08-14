import { useState } from "react";

import type { Vacancy } from "./types";

export const useExtension = () => {
  const [data, setData] = useState<Vacancy | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  return { data, isLoading, error };
};
