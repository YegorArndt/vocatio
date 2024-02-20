import { BsPlusCircleDotted } from "react-icons/bs";
import { useGeneratedData } from "~/hooks/useGeneratedData";
import { BUTTON_CN } from "../constants";
import { cn } from "~/utils";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "~/components/ui/external/Popover";
import { Button } from "~/components/ui/buttons/Button";
import { useCallback, useState } from "react";
import { get } from "lodash-es";
import { Switch } from "~/components/ui/external/Switch";
import { BiPlus } from "react-icons/bi";
import { uuidv4 } from "~/modules/utils";
import { Events, eventManager } from "~/modules/EventManager";
import {
  Items,
  LocalStorageManager,
  LsSkills,
} from "~/modules/LocalStorageManager";

const { log } = console;

type ActiveTab = 0 | 1;

const useForceUpdate = () => {
  const [, setTick] = useState(0);
  const update = useCallback(() => {
    setTick((tick) => tick + 1);
  }, []);
  return update;
};

export const AddSkillsPopover = () => {
  const { generated } = useGeneratedData();

  const [activeTab, setActiveTab] = useState<ActiveTab>(0);
  const [search, setSearch] = useState("");
  const [displayOnlyMissing, setDisplayOnlyMissing] = useState(false);

  const skills = {
    0: get(generated, "vacancySkills", []),
    1: get(generated, "skills", []).map((s) => s?.name),
  };

  const forceUpdate = useForceUpdate();

  const addSkill = (skill: string) => {
    if (!generated?.vacancy?.id) return;

    const currentSkills = LocalStorageManager.getInstance().getItem<LsSkills>(
      Items.SKILLS
    );
    const newSkills = [...(currentSkills ?? []), { name: skill, id: uuidv4() }];

    eventManager.emit(Events.SKILLS_UPDATED_EVENT, newSkills);
    forceUpdate();
  };

  const getFilteredSkills = () => {
    const currentSkills = LocalStorageManager.getInstance()
      .getItem<LsSkills>(Items.SKILLS)!
      .map((x) => x.name.toLowerCase());

    return skills[activeTab]
      .filter((s) => s.toLowerCase().includes(search.toLowerCase()))
      .filter((s) =>
        displayOnlyMissing ? !currentSkills.includes(s.toLowerCase()) : true
      );
  };

  return (
    <Popover>
      <PopoverTrigger className={cn(BUTTON_CN, "gap-2 p-2")}>
        <BsPlusCircleDotted /> Add skills
      </PopoverTrigger>
      {generated && (
        <PopoverContent
          onClick={(e) => e.stopPropagation()}
          side="left"
          sideOffset={130}
          className="h-full w-[800px] !bg-card"
        >
          <div className="size-full overflow-auto">
            <header className="grid grid-cols-2">
              {["From vacancy", "From my skills"].map((tab, i) => (
                <Button
                  key={tab}
                  text={tab}
                  onClick={() => setActiveTab(i as ActiveTab)}
                  className={cn("hover:bg-gray-100 p-2 text-lg", {
                    "border-bottom": i === activeTab,
                  })}
                />
              ))}
            </header>
            <input
              placeholder="Search skills here..."
              className="h-[70px] w-full bg-transparent outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
            <section className="flex flex-wrap gap-2 overflow-auto">
              {getFilteredSkills().map((s) => (
                <Button
                  key={s}
                  frontIcon={<BiPlus />}
                  text={s}
                  className="flex-y rounded-md border bg-primary p-2"
                  onClick={() => addSkill(s)}
                />
              ))}
            </section>
            <label className="flex-y gap-2 py-4">
              <Switch
                checked={displayOnlyMissing}
                onClick={() => setDisplayOnlyMissing(!displayOnlyMissing)}
              />
              Show only skills I haven&apos;t added yet
            </label>
          </div>
        </PopoverContent>
      )}
    </Popover>
  );
};
