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
import { BiPlus } from "react-icons/bi";
import { AiPicker } from "~/components/AiPicker";
import { EXPERIENCE_ENTRY_ADDED_BY_USER_EVENT } from "~/modules/constants";
import { usePersistentData } from "~/hooks/usePersistentData";
import { GeneratedExperience } from "~/modules/init-gen/types";

const { log } = console;

export const AddExperiencePopover = () => {
  const { currentDraft } = useCurrentDraft();
  const { ls } = usePersistentData();

  const addExperience = (shouldGenerate?: boolean) => {
    if (!currentDraft || !ls.user) return;

    // @ts-ignore
    let newExperienceEntry: GeneratedExperience[number] = {
      ...currentDraft.generatedExperience[0],
      id: `${Math.random()}`,
      place: "Company name",
      title: ls.user.jobTitle!,
    };

    const newExperience = [
      newExperienceEntry,
      ...currentDraft.generatedExperience,
    ];

    document.dispatchEvent(
      new CustomEvent(EXPERIENCE_ENTRY_ADDED_BY_USER_EVENT, {
        detail: newExperience,
      })
    );
  };

  return (
    <Popover>
      <PopoverTrigger className={cn(BUTTON_CN, "gap-2 p-2")}>
        <BsPlusCircleDotted /> Add new experience entry
      </PopoverTrigger>
      {currentDraft && (
        <PopoverContent
          onClick={(e) => {
            e.stopPropagation();
          }}
          side="top"
          className="flex w-[600px] flex-col gap-3 !bg-card"
        >
          <Button
            frontIcon={<BiPlus />}
            text="Add a blank entry"
            baseCn="flex-y hover:underline"
            onClick={() => addExperience()}
          />
          <div className="flex-y gap-4 whitespace-nowrap">
            Or tailor it to job posting. Click on the model to generate
            <AiPicker onModelChange={(model) => null} />
          </div>
        </PopoverContent>
      )}
    </Popover>
  );
};
