import cn from "classnames";
import { api } from "~/utils";
import { Wrapper } from "./Wrapper";
import { FormContext } from "../../FormContext";
import { EntryHydrationSkeleton } from "~/components/Spinner";
import { SaveButton } from "~/components/SaveButton";
import { SkillEntry } from "@prisma/client";
import { Select, SelectProps } from "~/components/ui/inputs/Select";
import { lowerCase, startCase } from "lodash-es";
import { PropsWithChildren } from "react";
import { ArrayFormContext } from "../../ArrayFormContext";
import { LuCopyPlus } from "react-icons/lu";
import { RiDeleteBin6Line } from "react-icons/ri";
import { AnimatedDiv } from "~/components/AnimatedDiv";
import { Button } from "~/components/ui/buttons/Button";
import { Placeholder } from "~/components";

const { log } = console;

type EntryBoxProps = PropsWithChildren<{
  entryFor: "languages" | "skills";
  labelOptions: SelectProps["options"][];
  valueOptions: SelectProps["options"][];
  className?: string;
}>;

const getFieldArray = (entries: SkillEntry[]) =>
  entries.map((e) => ({
    name: { label: e.name, value: e.name },
    level: { label: startCase(lowerCase(e.level)), value: e.level },
  }));

export const EntryBox = (props: EntryBoxProps) => {
  const { entryFor, labelOptions, valueOptions, children } = props;
  const {
    data: user,
    isLoading: userLoading,
    isFetching,
  } = api.users.get.useQuery();
  const {
    mutate,
    isSuccess,
    isLoading: userUpdating,
    reset,
  } = api.users.update.useMutation();

  const defaultValues = {
    entries: user?.[entryFor] ? getFieldArray(user[entryFor]) : [],
  };

  /**
   * Show skeleton if the user fine-tunes the box for the first time.
   */
  const isHydrating =
    !userLoading && isFetching && defaultValues.entries.length === 0;

  const onSubmit = (values: typeof defaultValues) => {
    const { entries } = values;
    const payload = entries.map((e) => ({
      name: e.name.value,
      level: e.level.value,
    }));

    mutate({
      [entryFor]: payload,
    });
  };

  return (
    <Wrapper
      entryFor={entryFor}
      className={cn({
        "pb-8": defaultValues.entries.length === 0,
      })}
    >
      {isHydrating && <EntryHydrationSkeleton />}
      {!userLoading && !isHydrating && defaultValues.entries.length > 0 && (
        <FormContext
          form={{
            defaultValues,
          }}
        >
          {({ formState, control }, submit) => (
            <>
              <ArrayFormContext>
                {({ form }) => (
                  <form className="flex flex-col gap-3">
                    {form.fields.map((field, index) => (
                      <AnimatedDiv
                        key={field.id}
                        className="grid grid-cols-2 gap-3"
                      >
                        <Select
                          control={control}
                          name={`entries.${index}.name`}
                          options={labelOptions}
                          noOptionsMessage={() =>
                            "Type your custom skill or visit advanced fine-tuning to get suggestions"
                          }
                        />
                        <div className="flex-y gap-2">
                          <Select
                            control={control}
                            name={`entries.${index}.level`}
                            options={valueOptions}
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
                                  level: field.level,
                                });
                              }}
                            >
                              <LuCopyPlus />
                            </Button>
                          </div>
                        </div>
                      </AnimatedDiv>
                    ))}
                  </form>
                )}
              </ArrayFormContext>
              <footer className="border-top flex-between w-full py-4">
                {children || (
                  <span className="clr-disabled">Add more if you need to.</span>
                )}
                <SaveButton
                  isLoading={userUpdating}
                  isSuccess={isSuccess}
                  disabled={!formState.isDirty}
                  reset={reset}
                  onClick={() => void submit(onSubmit)}
                />
              </footer>
            </>
          )}
        </FormContext>
      )}
      {defaultValues.entries.length === 0 && !isHydrating && (
        <Placeholder
          className="!h-[200px] [&>*]:h-[200px] [&>*]:w-full [&>*]:border"
          text="Don't type it manually. Instead choose a method to share your data with Vocatio."
          actionContent={null}
        >
          <Button text="I'm ok typing it manually" className="primary sm" />
        </Placeholder>
      )}
    </Wrapper>
  );
};
