import { FormContext } from "../../../../../components/FormContext";
import { ArrayFormContext } from "../../ArrayFormContext";
import { AnimatedDiv } from "~/components/AnimatedDiv";
import { Button } from "~/components/ui/buttons/Button";
import { Spinner } from "~/components";
import { BoxName } from "../../types";
import { useState } from "react";
import { Text } from "~/components/ui/inputs/Text";
import { TiTimes } from "react-icons/ti";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/external/Tooltip";
import { BsPlusCircleDotted } from "react-icons/bs";
import { Thunder } from "~/components/icons";
import { cn } from "~/utils";
import { SkillEntry } from "@prisma/client";

const { log } = console;

type EntryBoxProps = {
  data: SkillEntry[];
  update: (data: any) => void;
  isUpdating: boolean;
  boxName: BoxName;
  isStubby?: boolean;
};

const isDuplicate = (fields: SkillEntry[], value: string) => {
  const omitted = fields.filter((item) => item.name !== value);
  const format = (str: string) => str.toLowerCase().replaceAll(".", "");

  return omitted.some((item: any) => format(item.name) === format(value));
};

export const SkillsBox = (props: EntryBoxProps) => {
  const { data, update, isUpdating, boxName } = props;
  const [filter, setFilter] = useState("");

  return (
    <section>
      <FormContext
        form={{
          defaultValues: data,
        }}
      >
        {({ formState, control, watch }, submit) => {
          return (
            <>
              <ArrayFormContext name={boxName}>
                {({ form }) => (
                  <>
                    <header className="flex-y border-bottom mb-5 gap-8 pb-1 focus:border-weiss">
                      <input
                        type="text"
                        placeholder="Type to filter"
                        value={filter}
                        className="w-full bg-transparent p-2 focus:outline-none"
                        onChange={(e) => setFilter(e.target.value)}
                        autoFocus
                      />
                      <Button
                        frontIcon={<BsPlusCircleDotted />}
                        text="New skill"
                        onClick={() => {
                          form.prepend({
                            name: "Skill name",
                            value: "New Skill",
                          });
                        }}
                        className="flex-y sm whitespace-nowrap rounded-md bg-blue font-semibold"
                      />
                    </header>
                    <div className="flex flex-wrap gap-3">
                      <TooltipProvider>
                        {form.fields.map((field, index) => {
                          const name = `${boxName}.${index}.name`;
                          const value = watch(name as any);
                          const matchesFilter = value
                            // @ts-ignore
                            .toLowerCase()
                            .includes(filter.toLowerCase());

                          return (
                            matchesFilter && (
                              <Tooltip key={field.id}>
                                <TooltipTrigger asChild>
                                  <AnimatedDiv
                                    className={cn(
                                      "flex gap-3 rounded-full bg-primary",
                                      {
                                        "wave-warning": isDuplicate(
                                          // @ts-ignore
                                          form.fields,
                                          value
                                        ),
                                      }
                                    )}
                                  >
                                    <Text
                                      control={control}
                                      name={name}
                                      className="!rounded-full !bg-transparent"
                                      adornment={
                                        <Tooltip>
                                          <TooltipTrigger
                                            className="mx-2 w-[15px] hover:clr-white"
                                            onClick={() => form.remove(index)}
                                          >
                                            <TiTimes />
                                          </TooltipTrigger>

                                          <TooltipContent sideOffset={15}>
                                            Delete &quot;
                                            {value as any}
                                            &quot;
                                          </TooltipContent>
                                        </Tooltip>
                                      }
                                    />
                                  </AnimatedDiv>
                                </TooltipTrigger>
                                {(value as any).length > 19 && (
                                  <TooltipContent>
                                    {value as any}
                                  </TooltipContent>
                                )}
                              </Tooltip>
                            )
                          );
                        })}
                      </TooltipProvider>
                    </div>
                  </>
                )}
              </ArrayFormContext>
              <footer className="border-top flex-between col-span-2 mt-8 w-full gap-3 py-4">
                <div className="clr-ghost flex-y gap-2">
                  <Thunder />
                  Based on these skills the AI decides what skills from the
                  vacancy to include in each of your CVs.
                  <br />
                  It will make educated assumptions based on the skills you
                  have.
                </div>
                <Button
                  frontIcon={isUpdating && <Spinner size={10} />}
                  text={isUpdating ? "Updating..." : "Update"}
                  onClick={() =>
                    void submit((data) => {
                      update({
                        // @ts-ignore
                        [boxName]: data[boxName].filter(
                          (item: any) => item.name !== ""
                        ),
                      });
                    })
                  }
                  className="sm primary-filled ml-auto"
                  disabled={isUpdating || !formState.isDirty}
                />
              </footer>
            </>
          );
        }}
      </FormContext>
    </section>
  );
};
