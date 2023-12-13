import { api } from "~/utils";
import { Text } from "~/components/ui/inputs/Text";
import { BlurImage } from "~/components";
import { Wrapper } from "./Wrapper";
import { DbBigEntry, FineTuneBoxProps } from "../types";
import { FormContext } from "../../FormContext";
import { typedKeys } from "~/modules/draft/utils/common";
import { BigEntry } from "~/modules/extension/types";
import { LineStack } from "~/components/Spinner";
import { Textarea } from "~/components/ui/inputs/Textarea";
import { SaveButton } from "~/components/SaveButton";
import { FcCheckmark } from "react-icons/fc";
import { Button } from "~/components/ui/buttons/Button";
import { TbRestore } from "react-icons/tb";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useEffect, useState } from "react";

const { log } = console;

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
  const [entries, setEntries] = useState<BigEntry[]>([]);

  useEffect(() => {
    if (userLoading || !user) return;
    const entries = user[entryFor] && filterForClient(user[entryFor]);
    setEntries(entries);
  }, [user]);

  /**
   * Show skeleton if the user fine-tunes the box for the first time.
   */
  const isHydrating =
    user &&
    !userLoading &&
    isFetching &&
    Object.keys(user[entryFor]).length === 0;

  const onSubmit = (values: (typeof entries)[number]) => {
    const payload = entries?.map((e) => {
      const { place, title } = values;
      const { place: p, title: t } = e;

      if (p === place && t === title) {
        return { ...e, ...values };
      }

      return e;
    });

    mutate({
      [entryFor]: payload,
    });
  };

  return (
    <Wrapper entryFor={entryFor} className="pb-8">
      {isHydrating && <LineStack className="w-full gap-5 [&>*]:h-5" />}
      {userLoading && <LineStack className="w-full gap-5 [&>*]:h-5" />}
      {!userLoading &&
        entries?.map((entry, i) => (
          <FormContext
            key={entry.place + entry.period}
            form={{
              defaultValues: entry,
            }}
          >
            {(
              { control, formState, reset: resetForm },
              submit,
              updateDefaults
            ) => (
              <div className="grid grid-cols-[3fr_4fr] gap-4">
                <header className="flex-y gap-4">
                  <BlurImage
                    src={entry.image}
                    alt={entry.place}
                    width={100}
                    height={100}
                  />
                  <div className="flex flex-col gap-3">
                    <Text name="place" control={control} />
                    <div className="flex-y gap-4">
                      <SaveButton
                        className="secondary ml-0 rounded-full"
                        isLoading={userUpdating}
                        isSuccess={isSuccess}
                        disabled={!formState.isDirty || userUpdating}
                        reset={resetCache}
                        onClick={() => submit(onSubmit)}
                      >
                        <FcCheckmark />
                      </SaveButton>
                      <Button
                        className="secondary sm rounded-full"
                        onClick={resetForm}
                      >
                        <TbRestore />
                      </Button>
                      <Button
                        className="secondary sm rounded-full"
                        onClick={() => {
                          const { place, title } = entry;
                          setEntries((prev) =>
                            prev?.filter((e) => {
                              const { place: p, title: t } = e;
                              return !(p === place && t === title);
                            })
                          );
                        }}
                      >
                        <RiDeleteBin6Line />
                      </Button>
                    </div>
                  </div>
                </header>
                <form className="flex flex-col gap-2">
                  {typedKeys(entry).map((name) => {
                    const shouldRender = name !== "image" && name !== "place";

                    if (!shouldRender) return null;

                    const isDescription = name === "description";

                    const props = {
                      key: name,
                      name,
                      control,
                      placeholder: isDescription
                        ? `Missing description. Hit enter to generate one.`
                        : `Missing ${name}`,
                    };
                    const Component = isDescription ? Textarea : Text;

                    return <Component {...props} />;
                  })}
                </form>
              </div>
            )}
          </FormContext>
        ))}
    </Wrapper>
  );
};
