import { FormContext } from "../../FormContext";
import { Select } from "~/components/ui/inputs/Select";
import { ArrayFormContext } from "../../ArrayFormContext";
import { LuCopyPlus } from "react-icons/lu";
import { RiDeleteBin6Line } from "react-icons/ri";
import { AnimatedDiv } from "~/components/AnimatedDiv";
import { Button } from "~/components/ui/buttons/Button";
import { Spinner } from "~/components";
import { SkillEntry } from "@prisma/client";
import { BiMoveVertical } from "react-icons/bi";

const { log } = console;

const getFieldArray = (entries: SkillEntry[]) =>
  entries &&
  entries.map((e) => ({
    name: { label: e.name, value: e.name },
    value: { label: e.value, value: e.value },
  }));

const reverseFieldArray = (fieldArray: ReturnType<typeof getFieldArray>) => {
  return fieldArray.map((item) => ({
    name: item.name?.value ?? "",
    value: item.value.value,
  }));
};

//@ts-ignore
export const EntryBox = (props) => {
  const { data, update, isUpdating, boxName } = props;
  const fieldArray = getFieldArray(data[boxName]);
  const defaultValues = { [boxName]: fieldArray };

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
                <form className="flex flex-col gap-3">
                  {form.fields.map((field, index) => (
                    <AnimatedDiv
                      key={field.id}
                      className="grid grid-cols-2 gap-3"
                    >
                      <Select
                        control={control}
                        name={`${boxName}.${index}.name`}
                        options={[]}
                        noOptionsMessage={() => "Start typing..."}
                      />
                      <div className="flex-y gap-2">
                        <Select
                          control={control}
                          name={`${boxName}.${index}.value`}
                          options={[]}
                          className="w-full"
                        />
                        <div className="flex-y gap-2">
                          <Button onClick={() => form.remove(index)}>
                            <RiDeleteBin6Line />
                          </Button>
                          <Button
                            onClick={() => {
                              form.insert(index + 1, {
                                name: field.name,
                                value: field.value,
                              });
                            }}
                          >
                            <LuCopyPlus />
                          </Button>
                          <Button
                            endIcon={<BiMoveVertical />}
                            onClick={() => form.swap(index, index + 1)!}
                          />
                        </div>
                      </div>
                    </AnimatedDiv>
                  ))}
                </form>
              )}
            </ArrayFormContext>
            <footer className="border-top flex-between col-span-2 mt-8 w-full gap-3 py-4">
              <Button
                frontIcon={isUpdating && <Spinner size={10} />}
                text={isUpdating ? "Updating..." : "Update"}
                onClick={() =>
                  void submit((data) => {
                    //@ts-ignore
                    update({ [boxName]: reverseFieldArray(data[boxName]) });
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
