import { startCase } from "lodash-es";
import { api } from "~/utils";
import { typedKeys } from "../../../draft/utils/common";
import { Text } from "~/components/ui/inputs/Text";
import { Fragment } from "react";
import { Button } from "~/components/ui/buttons/Button";
import { useUser } from "@clerk/nextjs";
import { ProfessionField } from "@prisma/client";
import { Wrapper } from "./Wrapper";
import { FormContext } from "../../FormContext";
import { FineTuneLink } from "./FineTuneLink";
import { LineStack } from "~/components/Spinner";
import { RouterOutputs } from "~/utils/api";

export const MainBox = () => {
  const { data: user, isLoading } = api.users.get.useQuery();
  const defaultUserData = useUser();

  const mainDefaults: Partial<RouterOutputs["users"]["get"]> = {
    name: user?.name || defaultUserData.user?.fullName || "",
    jobTitle: user?.jobTitle || "",
    professionField: user?.professionField || ProfessionField.UI_UX_DESIGNER,
    objective: user?.objective,
  };

  return (
    <Wrapper>
      <header className="flex-between">
        <h4 id="main">Main</h4>
        <FineTuneLink />
      </header>
      {isLoading && <LineStack />}
      {!isLoading && (
        <FormContext
          form={{
            defaultValues: mainDefaults,
          }}
        >
          {({ control, formState }) => (
            <>
              <form className="grid grid-cols-2 gap-3">
                {typedKeys(mainDefaults).map((key) => (
                  <Fragment key={key}>
                    <label htmlFor={key}>{startCase(key)}</label>
                    <Text id={key} name={key} control={control} />
                  </Fragment>
                ))}
              </form>
              <footer className="border-top flex-between w-full py-4">
                <span className="clr-disabled">
                  Please review the data we were able to get from LinkedIn and
                  change it if needed.
                </span>
                <Button
                  text="Save"
                  disabled={!formState.isDirty}
                  className="primary sm ml-auto w-1/5"
                />
              </footer>
            </>
          )}
        </FormContext>
      )}
    </Wrapper>
  );
};
