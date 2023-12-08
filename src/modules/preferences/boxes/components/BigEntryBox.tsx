import { api } from "~/utils";
import { Button } from "~/components/ui/buttons/Button";
import { Text } from "~/components/ui/inputs/Text";
import { BlurImage } from "~/components";
import { startCase } from "lodash-es";
import { Wrapper } from "./Wrapper";
import { DbBigEntry, FineTuneBoxProps } from "../types";
import { FineTuneLink } from "./FineTuneLink";
import { FormContext } from "../../FormContext";
import { title } from "process";
import { typedKeys } from "~/modules/draft/utils/common";
import { BigEntry } from "~/modules/extension/types";
import { LineStack } from "~/components/Spinner";

const filterForClient = (entries: DbBigEntry[]): BigEntry[] => {
  return entries.map((e) => {
    return {
      place: e.place,
      image: e.image,
      title: e.title,
      description: e.description,
      period: e.period,
    };
  });
};

export const BigEntryBox = (props: FineTuneBoxProps) => {
  const { entryFor } = props;
  const { data: user, isLoading, isFetching } = api.users.get.useQuery();

  const entryNameForUser = startCase(entryFor);
  const entries = user && user[entryFor] && filterForClient(user[entryFor]);

  /**
   * Show skeleton if the user fine-tunes the box for the first time.
   */
  const isHydrating =
    user &&
    !isLoading &&
    isFetching &&
    Object.keys(user[entryFor]).length === 0;

  return (
    <Wrapper>
      <header className="flex-between">
        <h4 id={entryFor}>{entryNameForUser}</h4>
        <FineTuneLink entryFor={entryFor} />
      </header>
      <section className="flex flex-col gap-8">
        {isHydrating && <LineStack className="w-full gap-5 [&>*]:h-5" />}
        {isLoading && <LineStack className="w-full gap-5 [&>*]:h-5" />}
        {!isLoading &&
          entries?.map((entry, i) => (
            <FormContext
              key={entry.title}
              form={{
                defaultValues: entry,
              }}
            >
              {({ control, formState }) => (
                <div className="grid grid-cols-2">
                  <header className="flex-between">
                    <div className="flex-y gap-4">
                      <BlurImage
                        src={entry.image}
                        alt={title}
                        width={100}
                        height={100}
                      />
                      <Text name="place" control={control} />
                    </div>
                  </header>
                  <form className="flex flex-col gap-2">
                    {typedKeys(entry).map(
                      (name) =>
                        name !== "image" && (
                          <Text key={name} name={name} control={control} />
                        )
                    )}
                  </form>
                </div>
              )}
            </FormContext>
          ))}
      </section>
      <footer className="border-top flex-between w-full py-4">
        <span className="clr-disabled">Add more if you need to.</span>
        <Button
          text="Save"
          //   disabled={!formState.isDirty}
          className="primary sm ml-auto w-1/5"
        />
      </footer>
    </Wrapper>
  );
};
