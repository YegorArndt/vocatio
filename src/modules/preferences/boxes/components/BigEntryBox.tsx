import cn from "classnames";
import { api } from "~/utils";
import { Placeholder } from "~/components";
import { Wrapper } from "./Wrapper";
import { BigEntry } from "~/modules/extension/types";
import { BigEntryHydrationSkeleton } from "~/components/Spinner";
import { Button } from "~/components/ui/buttons/Button";
import { EducationEntry, EmploymentHistoryEntry } from ".prisma/client";
import { FormContext } from "../../FormContext";
import { ArrayForm2 } from "./ArrayForm2";
import { SaveButton } from "~/components/SaveButton";
import { omit } from "lodash-es";

const { log } = console;

const getFieldArray = (
  entries: (EmploymentHistoryEntry | EducationEntry)[]
): BigEntry[] => {
  return entries.map((e) => {
    return omit(e, "id", "createdAt", "updatedAt", "skills", "userId");
  });
};

export const BigEntryBox = (props: {
  entryFor: "employmentHistory" | "education";
}) => {
  const { entryFor } = props;
  const {
    data: user,
    isLoading: userLoading,
    isFetching,
  } = api.users.get.useQuery();
  const {
    mutate,
    isSuccess,
    isLoading: userUpdating,
    reset: resetCache,
  } = api.users.update.useMutation();

  const defaultValues = {
    entries: user?.[entryFor] ? getFieldArray(user[entryFor]) : [],
  };

  /**
   * Show skeleton if the user fine-tunes the box for the first time.
   */
  const isHydrating =
    user &&
    !userLoading &&
    isFetching &&
    Object.keys(user[entryFor]).length === 0;

  const onSubmit = (values: typeof defaultValues) => {
    const { entries } = values;

    mutate({
      [entryFor]: entries,
    });
  };

  return (
    <Wrapper
      entryFor={entryFor}
      className={cn("relative", {
        "pb-8": defaultValues.entries.length === 0,
      })}
    >
      {isHydrating && <BigEntryHydrationSkeleton />}
      {!userLoading && defaultValues.entries.length > 0 && (
        <FormContext
          form={{
            defaultValues,
          }}
        >
          {({ formState }, submit) => (
            <>
              <ArrayForm2 />
              <footer className="border-top flex-center py-5">
                <SaveButton
                  isSuccess={isSuccess}
                  isLoading={userUpdating}
                  disabled={!formState.isDirty}
                  reset={resetCache}
                  onClick={() => submit(onSubmit)}
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
