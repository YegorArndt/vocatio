import { useState, useEffect } from "react";
import { useLs } from "./useLs";

const { log } = console;

export type Theme = "light" | "dark";

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>("dark");
  const { ls, updateLs } = useLs();

  useEffect(() => {
    if (!ls.isLoaded) return;

    const { theme } = ls;
    if (theme) setTheme(theme);
  }, [ls]);

  const updateTheme = (theme: Theme) => {
    setTheme(theme);
    updateLs({ theme });
  };

  return [theme, updateTheme] as const;
};
