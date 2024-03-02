import { useEffect, useState } from "react";
import { eventManager } from "~/modules/events/EventManager";
import {
  Events,
  type EventHandler,
  PopoverEvents,
} from "~/modules/events/types";

/**
 * Tech debt. TODO.
 */

type UseEventsProps = {
  [Events.GEN_UPDATED]?: EventHandler<any>;
  [Events.ON_LOAD]?: EventHandler<any>;
  [Events.DESIGN_CHANGED]?: EventHandler<any>;
  [Events.SETTINGS_UPDATED]?: EventHandler<any>;
  [PopoverEvents.BOLDEN_SUMMARY]?: EventHandler<any>;
  [PopoverEvents.BOLDEN_BULLETS]?: EventHandler<any>;
  [PopoverEvents.SKILLS_UPDATED]?: EventHandler<any>;
  [PopoverEvents.BULLETS_UPDATED]?: EventHandler<any>;
  [PopoverEvents.ENTRY_ADDED]?: EventHandler<any>;
  [Events.THEME_UPDATED]?: EventHandler<any>;
};

const events: (keyof UseEventsProps)[] = [
  Events.GEN_UPDATED,
  Events.ON_LOAD,
  Events.DESIGN_CHANGED,
  Events.SETTINGS_UPDATED,
  PopoverEvents.BOLDEN_SUMMARY,
  PopoverEvents.BOLDEN_BULLETS,
  PopoverEvents.SKILLS_UPDATED,
  PopoverEvents.BULLETS_UPDATED,
  PopoverEvents.ENTRY_ADDED,
  Events.THEME_UPDATED,
];

export const useEvents = (props: UseEventsProps) => {
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    events.forEach((event) => {
      const handler = props[event];
      if (!handler) return;
      document.addEventListener(event, handler as EventListener);

      return () =>
        document.removeEventListener(event, handler as EventListener);
    });
  }, []);

  useEffect(() => {
    if (hasLoaded) return;
    eventManager.emit(Events.ON_LOAD);
    setHasLoaded(true);
  }, []);
};
