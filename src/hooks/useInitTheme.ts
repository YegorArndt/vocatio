import { useEffect } from "react";
import { useLs } from "./useLs";

const { log } = console;

export type Theme = "light" | "dark";

export const useInitTheme = () => {
  const { ls } = useLs();

  /**
   * Set theme on local storage
   */
  useEffect(() => {
    if (!ls.isLoaded) return;
    const { theme } = ls;

    /**
     * Set it on body
     */
    const { body } = document;
    body.dataset.theme = theme;
  }, [ls]);
};
