import { FormContext } from "../../../../../components/FormContext";
import { Select } from "~/components/ui/inputs/Select";
import { ArrayFormContext } from "../../ArrayFormContext";
import { LuCopyPlus } from "react-icons/lu";
import { RiDeleteBin6Line } from "react-icons/ri";
import { AnimatedDiv } from "~/components/AnimatedDiv";
import { Button } from "~/components/ui/buttons/Button";
import { Spinner } from "~/components";
import { SkillEntry } from "@prisma/client";
import { BoxName } from "../../types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/external/Tooltip";
import { typedEntries } from "~/modules/utils";
import { Fragment } from "react";
import { BiMoveVertical } from "react-icons/bi";
import { Divider } from "~/components/layout/Divider";

const { log } = console;

type EntryBoxProps = {
  data: any;
  update: (data: any) => void;
  isUpdating: boolean;
  boxName: BoxName;
  isStubby?: boolean;
};

const getFieldArray = (entries: SkillEntry[]) =>
  entries?.map((e) => ({
    name: { label: e.name, value: e.name },
    value: { label: e.value, value: e.value },
  }));

const reverseFieldArray = (fieldArray: ReturnType<typeof getFieldArray>) => {
  return fieldArray.map((item) => ({
    name: item.name?.value ?? "",
    value: item.value.value,
  }));
};

export const EntryBox = (props: EntryBoxProps) => {
  const { data, update, isUpdating, boxName } = props;
  const fieldArray = getFieldArray(data[boxName]);
  const defaultValues = { [boxName]: fieldArray };

  const mapping = {
    delete: {
      fn: (index: number, form: any) => form.remove(index),
      icon: RiDeleteBin6Line,
      tooltip: "Delete",
    },
    duplicate: {
      fn: (index: number, form: any) =>
        form.insert(index + 1, form.fields[index]),
      icon: LuCopyPlus,
      tooltip: "Duplicate",
    },
  };

  return (
    <FormContext
      form={{
        defaultValues,
      }}
    >
      {({ formState, control }, submit) => {
        return (
          <>
            <ArrayFormContext name={boxName}>
              {({ form }) => (
                <div className="flex flex-col gap-3">
                  {form.fields.map((field, index) => (
                    <Fragment key={field.id}>
                      <AnimatedDiv className="grid grid-cols-2 gap-3">
                        <Select
                          control={control}
                          name={`${boxName}.${index}.name`}
                          options={[]}
                          noOptionsMessage={() => "Start typing..."}
                        />
                        <div className="flex-y gap-5">
                          <Select
                            control={control}
                            name={`${boxName}.${index}.value`}
                            options={[]}
                            className="w-full"
                          />
                          <div className="flex-y gap-3">
                            <TooltipProvider>
                              {typedEntries(mapping).map(([key, value]) => (
                                <Tooltip key={key}>
                                  <TooltipTrigger
                                    onClick={() => value.fn(index, form)}
                                  >
                                    <value.icon fontSize={17} />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    {value.tooltip}
                                  </TooltipContent>
                                </Tooltip>
                              ))}
                            </TooltipProvider>
                          </div>
                        </div>
                      </AnimatedDiv>
                      {index < form.fields.length - 1 && (
                        <div className="flex-center py-3">
                          <Divider />
                          <Button
                            text="Swap"
                            endIcon={<BiMoveVertical />}
                            onClick={() => form.swap(index, index + 1)!}
                            className="flex-y px-5 text-xs"
                          />
                          <Divider />
                        </div>
                      )}
                    </Fragment>
                  ))}
                </div>
              )}
            </ArrayFormContext>
            <footer className="border-top flex-between col-span-2 mt-8 w-full gap-3 py-4">
              {boxName === "skills" && <div>Add as many as possible.</div>}
              <Button
                frontIcon={isUpdating && <Spinner size={10} />}
                text={isUpdating ? "Updating..." : "Update"}
                onClick={() =>
                  void submit((data) => {
                    //@ts-ignore
                    update({
                      //@ts-ignore
                      [boxName]: reverseFieldArray(data[boxName]),
                    });
                  })
                }
                className="primary sm flex-y ml-auto"
                disabled={isUpdating || !formState.isDirty}
              />
            </footer>
          </>
        );
      }}
    </FormContext>
  );
};
