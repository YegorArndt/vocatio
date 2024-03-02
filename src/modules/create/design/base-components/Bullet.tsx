import { useEvents } from "~/hooks/useEvents";
import { useComponentContext } from "../contexts/ComponentContext";
import { useDesignContext } from "../contexts/DesignContext";
import { Autoresize } from "./Autoresize";
import { PopoverEvents } from "~/modules/events/types";
import { useEffect, useState } from "react";
import { getSettings } from "~/modules/settings/settings";

const { log } = console;

export const Bullet = () => {
  const c = useComponentContext();
  const { value: initialValue, ...rest } = c.hydratedProps || {};
  const { design } = useDesignContext();
  const className = design.baseComponents.bullet.className + " bullet";

  const [value, setValue] = useState(initialValue);

  const handler = () => {
    const settings = getSettings();
    const boldenBullets = settings[PopoverEvents.BOLDEN_BULLETS];

    const updatedValue = boldenBullets
      ? value
      : value?.replaceAll("font-bold", "");

    setValue(updatedValue);
  };

  useEffect(handler, []);

  useEvents({
    [PopoverEvents.BOLDEN_BULLETS]: handler,
  });

  return <Autoresize className={className} value={value} {...rest} />;
};
