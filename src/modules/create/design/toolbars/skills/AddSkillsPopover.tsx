import { BsPlusCircleDotted } from "react-icons/bs";
import { useCurrentDraft } from "~/hooks/useCurrentDraft";
import { BUTTON_CN } from "../constants";
import { cn } from "~/utils";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "~/components/ui/external/Popover";
import { Button } from "~/components/ui/buttons/Button";
import { useMemo, useState } from "react";
import { get } from "lodash-es";
import { Switch } from "~/components/ui/external/Switch";
import { SKILLS_UPDATED_EVENT } from "~/modules/init-gen/constants";
import { BiPlus } from "react-icons/bi";

const { log } = console;

export const AddSkillsPopover = () => {
  const { currentDraft, updateDraft } = useCurrentDraft();

  const [activeTab, setActiveTab] = useState(0);
  const [search, setSearch] = useState("");
  const [displayOnlyMissing, setDisplayOnlyMissing] = useState(false);

  const skills = useMemo(() => {
    return {
      0: get(currentDraft, "vacancySkills", []),
      1: get(currentDraft, "skills", []).map((s) => s?.name),
    };
  }, [currentDraft]);

  const addSkill = (skill: string) => {
    if (!currentDraft) return;

    const newSkills = [
      ...currentDraft.generatedSkills,
      { name: skill, id: `${Math.random()}` },
    ];

    updateDraft?.({
      ...currentDraft,
      generatedSkills: newSkills,
    });
    document.dispatchEvent(
      new CustomEvent(SKILLS_UPDATED_EVENT, { detail: { newSkills } })
    );
  };

  return (
    <Popover>
      <PopoverTrigger className={cn(BUTTON_CN, "gap-2 p-2")}>
        <BsPlusCircleDotted /> Add skills
      </PopoverTrigger>
      {currentDraft && (
        <PopoverContent
          onClick={(e) => {
            e.stopPropagation();
          }}
          side="left"
          sideOffset={130}
          className="w-[600px] !bg-card"
        >
          <header className="grid grid-cols-2">
            {["From vacancy", "From my skills"].map((tab, i) => (
              <Button
                key={tab}
                text={tab}
                onClick={() => {
                  setActiveTab(i);
                  log(i);
                }}
                className={cn("p-2", "hover:bg-gray-100", {
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
          <section className="flex flex-wrap gap-2">
            {skills[activeTab as 0 | 1]
              .filter((s) => s.toLowerCase().includes(search.toLowerCase()))
              .filter(
                (s) =>
                  !displayOnlyMissing ||
                  !currentDraft.generatedSkills
                    .map((x) => x.name.toLowerCase())
                    .includes(s.toLowerCase())
              )
              .map((s) => (
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
        </PopoverContent>
      )}
    </Popover>
  );
};