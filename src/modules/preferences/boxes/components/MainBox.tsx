import { startCase } from "lodash-es";
import { api } from "~/utils";
import { typedKeys } from "../../../draft/utils/common";
import { Text } from "~/components/ui/inputs/Text";
import { Fragment } from "react";
import { useUser } from "@clerk/nextjs";
import { User } from "@prisma/client";
import { Wrapper } from "./Wrapper";
import { FormContext } from "../../FormContext";
import { LineStack } from "~/components/Spinner";
import { Textarea } from "~/components/ui/inputs/Textarea";
import { SaveButton } from "~/components/SaveButton";
import { UserUpdateArgs } from "~/server/api/utils/schemas";

const { log } = console;

export const MainBox = () => {
  const { data: user, isLoading: userLoading } = api.users.get.useQuery();
  const {
    mutate,
    isLoading: userUpdating,
    isSuccess,
    reset,
  } = api.users.update.useMutation();
  const defaultUserData = useUser();

  const mainDefaults: Partial<User> = {
    name: user?.name || defaultUserData.user?.fullName || "",
    jobTitle: user?.jobTitle || "",
    professionalSummary: user?.professionalSummary,
  };

  const onSubmit = (values: typeof mainDefaults) => {
    mutate(values as UserUpdateArgs);
  };

  return (
    <Wrapper entryFor="main">
      {userLoading && <LineStack />}
      {!userLoading && (
        <FormContext
          form={{
            defaultValues: mainDefaults,
          }}
        >
          {({ control, formState }, submit) => (
            <>
              <form className="grid grid-cols-2 gap-3">
                {typedKeys(mainDefaults).map(
                  (key) =>
                    key !== "professionalSummary" && (
                      <Fragment key={key}>
                        <label htmlFor={key}>{startCase(key)}</label>
                        <Text id={key} name={key} control={control} />
                      </Fragment>
                    )
                )}
                <label htmlFor="professionalSummary">
                  Professional summary
                </label>
                <Textarea
                  name="professionalSummary"
                  control={control}
                  className="col-span-2"
                  rows={10}
                />
              </form>
              <footer className="border-top flex-between col-span-2 w-full gap-3 py-4">
                <span className="inline-flex items-center clr-disabled">
                  In the future you'll be able to dynamically insert company
                  name, logo, and more, and regulate what changes ChatGPT makes
                  to further improve your Professional Summary.
                </span>
                <SaveButton
                  isLoading={userUpdating}
                  isSuccess={isSuccess}
                  reset={reset}
                  disabled={!formState.isDirty || userUpdating}
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
