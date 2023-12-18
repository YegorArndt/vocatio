import { api } from "~/utils";
import { Wrapper } from "./Wrapper";
import { FormContext } from "../../FormContext";
import { EntryHydrationSkeleton } from "~/components/Spinner";
import { ArrayForm } from "./ArrayForm";
import { SaveButton } from "~/components/SaveButton";
import { SkillEntry } from "@prisma/client";
import { SelectProps } from "~/components/ui/inputs/Select";
import { lowerCase, startCase } from "lodash-es";

const { log } = console;

const getFieldArray = (entries: SkillEntry[]) =>
  entries.map((e) => ({
    name: { label: e.name, value: e.name },
    level: { label: startCase(lowerCase(e.level)), value: e.level },
  }));

type EntryBoxProps = {
  entryFor: "languages" | "skills";
  labelOptions: SelectProps["options"][];
  valueOptions: SelectProps["options"][];
  className?: string;
};

export const EntryBox = (props: EntryBoxProps) => {
  const { entryFor, labelOptions, valueOptions } = props;
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
    <Wrapper entryFor={entryFor}>
      {isHydrating && <EntryHydrationSkeleton />}
      {!userLoading && !isHydrating && defaultValues.entries.length > 0 && (
        <FormContext
          form={{
            defaultValues,
          }}
        >
          {({ formState }, submit) => (
            <>
              <ArrayForm
                labelOptions={labelOptions}
                valueOptions={valueOptions}
              />
              <footer className="border-top flex-between w-full py-4">
                <span className="clr-disabled">Add more if you need to.</span>
                <SaveButton
                  isLoading={userUpdating}
                  isSuccess={isSuccess}
                  disabled={!formState.isDirty}
                  reset={reset}
                  onClick={() => submit(onSubmit)}
                />
              </footer>
            </>
          )}
        </FormContext>
      )}
    </Wrapper>
  );
};
