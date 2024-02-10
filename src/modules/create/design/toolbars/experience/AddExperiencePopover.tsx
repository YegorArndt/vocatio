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
import { EXPERIENCE_UPDATED_EVENT } from "~/modules/init-gen/constants";
import { GeneratedDraft } from "../../types";

const { log } = console;

export const AddExperiencePopover = () => {
  const { currentDraft, updateDraft } = useCurrentDraft();

  const addExperience = (shouldGenerate?: boolean) => {
    if (!currentDraft) return;

    // @ts-ignore
    let newExperienceEntry: GeneratedDraft["generatedExperience"][number] = {
      ...currentDraft.generatedExperience[0],
      id: `${Math.random()}`,
      place: "Company name",
      title: currentDraft.jobTitle!,
    };

    const newExperience = [
      newExperienceEntry,
      ...currentDraft.generatedExperience,
    ];

    updateDraft?.({
      ...currentDraft,
      generatedExperience: newExperience,
    });
    document.dispatchEvent(
      new CustomEvent(EXPERIENCE_UPDATED_EVENT, { detail: { newExperience } })
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
