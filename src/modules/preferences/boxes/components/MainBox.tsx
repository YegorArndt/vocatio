import { startCase } from "lodash-es";
import { api } from "~/utils";
import { typedKeys } from "../../../draft/utils/common";
import { Text } from "~/components/ui/inputs/Text";
import { Fragment } from "react";
import { useUser } from "@clerk/nextjs";
import { ProfessionField, User } from "@prisma/client";
import { Wrapper } from "./Wrapper";
import { FormContext } from "../../FormContext";
import { LineStack } from "~/components/Spinner";
import { Textarea } from "~/components/ui/inputs/Textarea";
import { SaveButton } from "~/components/SaveButton";
import { ComingSoon } from "~/components";

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
    professionField: user?.professionField || ProfessionField.UI_UX_DESIGNER,
    objective: user?.objective,
  };

  const onSubmit = (values: typeof mainDefaults) => {
    mutate(values);
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
                    key !== "objective" && (
                      <Fragment key={key}>
                        <label htmlFor={key}>{startCase(key)}</label>
                        <Text id={key} name={key} control={control} />
                      </Fragment>
                    )
                )}
                <label
                  htmlFor="objective"
                  className="flex-y col-span-2 mt-5 text-[0.9rem] leading-9"
                >
                  <div>
                    If need be you can dynamically insert the following
                    information about the job posting into your objective:{` `}
                    <code>
                      {
                        "{companyName}, {jobTitle}, {location}, {industry}, {companyLogo}"
                      }
                    </code>
                  </div>
                  <ComingSoon />
                </label>
                <Textarea
                  name="objective"
                  control={control}
                  className="col-span-2"
                  rows={10}
                />
              </form>
              <footer className="border-top flex-between col-span-2 w-full py-4">
                <span className="clr-disabled">
                  Please review the data we were able to get from LinkedIn and
                  change it if needed.
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
