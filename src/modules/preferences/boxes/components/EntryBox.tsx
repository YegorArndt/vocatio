import { startCase } from "lodash-es";
import { api } from "~/utils";
import { typedKeys } from "../../../draft/utils/common";
import { Text } from "~/components/ui/inputs/Text";
import { Fragment } from "react";
import { Button } from "~/components/ui/buttons/Button";
import { SkillEntry } from "@prisma/client";
import { Wrapper } from "./Wrapper";
import { FormContext } from "../../FormContext";
import { FineTuneLink } from "./FineTuneLink";
import { FineTuneBoxProps } from "../types";
import { LineStack } from "~/components/Spinner";

const filterForClient = (entries: SkillEntry[]) => {
  const resultEntries = {};

  entries.forEach((entry) => {
    const { name, level } = entry;
    resultEntries[name] = level;
  });

  return resultEntries;
};

export const EntryBox = (props: FineTuneBoxProps) => {
  const { entryFor } = props;
  const { data: user, isLoading, isFetching } = api.users.get.useQuery();

  const entryNameForUser = startCase(entryFor);
  const filtered = filterForClient(user[entryFor]);

  /**
   * Show skeleton if the user fine-tunes the box for the first time.
   */
  const isHydrating =
    !isLoading && isFetching && Object.keys(filtered).length === 0;

  return (
    <Wrapper>
      <header className="flex-between">
        <h4 id={entryFor}>{entryNameForUser}</h4>
        <FineTuneLink entryFor={entryFor} />
      </header>
      {isHydrating && <LineStack className="w-full gap-5 [&>*]:h-5" />}
      {isLoading && <LineStack className="w-full gap-5 [&>*]:h-5" />}
      {!isLoading && !isHydrating && (
        <FormContext
          form={{
            defaultValues: filtered,
          }}
        >
          {({ control, formState }) => (
            <>
              <form className="grid grid-cols-2 gap-3">
                {typedKeys(filtered).map((key) => (
                  <Fragment key={key}>
                    <label htmlFor={key}>{key}</label>
                    <Text id={key} name={key} control={control} />
                  </Fragment>
                ))}
              </form>
              <footer className="border-top flex-between w-full py-4">
                <span className="clr-disabled">Add more if you need to.</span>
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
