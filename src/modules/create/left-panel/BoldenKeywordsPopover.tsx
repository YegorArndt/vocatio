import { FaBold } from "react-icons/fa";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/external/Popover";
import { NAV_BUTTON_CN } from "./constants";
import { cn } from "~/utils";
import { Switch } from "~/components/ui/external/Switch";
import { typedEntries } from "~/modules/utils";
import { SettingsAccessor } from "~/components/SettingsAccessor";
import { eventManager } from "~/modules/events/EventManager";
import { PopoverEvents } from "~/modules/events/types";

const { log } = console;

type Key = PopoverEvents.BOLDEN_SUMMARY | PopoverEvents.BOLDEN_BULLETS;

const mapping: Partial<Record<Key, string>> = {
  [PopoverEvents.BOLDEN_SUMMARY]: "Summary",
  [PopoverEvents.BOLDEN_BULLETS]: "Bullet points",
};

export const BoldenKeywordsPopover = () => {
  return (
    <Popover>
      <PopoverTrigger className={cn(NAV_BUTTON_CN, "gap-2")}>
        <FaBold /> Bolden keywords
      </PopoverTrigger>
      <PopoverContent side="right" className="flex flex-col gap-3">
        {typedEntries(mapping).map(([key, value]) => (
          <label key={key} className="flex-between">
            {value}
            <SettingsAccessor>
              {({ settings, updater }) => {
                const checked = !!settings[key];

                return (
                  <Switch
                    checked={checked}
                    onClick={() => {
                      updater((prev) => ({ ...prev, [key]: !checked }));
                      eventManager.emit(key);
                    }}
                  />
                );
              }}
            </SettingsAccessor>
          </label>
        ))}
      </PopoverContent>
    </Popover>
  );
};
