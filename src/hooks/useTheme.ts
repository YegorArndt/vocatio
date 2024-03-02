import { useEffect } from "react";
import { useEvents } from "./useEvents";
import { EventHandler, Events } from "~/modules/events/types";
import { getSettings } from "~/modules/settings/settings";

const { log } = console;

export type Theme = "light" | "dark";

export const useTheme = () => {
  const handler: EventHandler<{ theme: Theme }> = (payload) => {
    const settings = getSettings();
    const { theme } = payload?.detail ?? settings;
    const { body } = document;
    body.dataset.theme = theme;
  };

  useEffect(handler, []);

  useEvents({
    [Events.THEME_UPDATED]: handler,
  });
};
