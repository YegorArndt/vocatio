import cn from "classnames";
import { api } from "~/utils";
import { BlurImage, Placeholder } from "~/components";
import { Wrapper } from "./Wrapper";
import { BigEntry } from "~/modules/extension/types";
import { BigEntryHydrationSkeleton } from "~/components/Spinner";
import { Button } from "~/components/ui/buttons/Button";
import { EducationEntry, EmploymentHistoryEntry } from ".prisma/client";
import { FormContext } from "../../FormContext";
import { SaveButton } from "~/components/SaveButton";
import { omit } from "lodash-es";
import { ArrayFormContext } from "../../ArrayFormContext";
import { Fragment } from "react";
import { LuCopyPlus } from "react-icons/lu";
import { RiDeleteBin6Line } from "react-icons/ri";
import { TbRestore } from "react-icons/tb";
import { AnimatedDiv } from "~/components/AnimatedDiv";
import { Textarea } from "~/components/ui/inputs/Textarea";
import { typedKeys } from "~/modules/draft/utils/common";
import { Text } from "~/components/ui/inputs/Text";
import { BiMoveVertical } from "react-icons/bi";
import { Divider } from "~/components/layout/Divider";

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
          {({ formState, control, resetField }, submit) => (
            <>
              <ArrayFormContext>
                {({ form }) => (
                  <>
                    {form.fields.map((field, index) => (
                      <Fragment key={index}>
                        <AnimatedDiv
                          key={field.id}
                          className="grid grid-cols-[3fr_4fr] gap-4"
                        >
                          <header className="flex-y gap-4">
                            {field.image ? (
                              <BlurImage
                                src={field.image}
                                alt="Missing image"
                                width={100}
                                height={100}
                                className="rounded-md"
                              />
                            ) : null}
                            <div className="flex flex-col gap-2">
                              <Text
                                name={`entries.${index}.place`}
                                control={control}
                              />
                              <div className="flex-y gap-2">
                                <Button onClick={() => form.remove(index)}>
                                  <RiDeleteBin6Line />
                                </Button>
                                <Button
                                  onClick={() => form.insert(index + 1, field)}
                                >
                                  <LuCopyPlus />
                                </Button>
                                <Button
                                  onClick={() => resetField(`entries.${index}`)}
                                >
                                  <TbRestore />
                                </Button>
                              </div>
                            </div>
                          </header>
                          <form className="flex flex-col gap-2">
                            {typedKeys(field).map((name, i) => {
                              const shouldRender = ![
                                "place",
                                "image",
                                "id",
                              ].includes(name);

                              if (!shouldRender) return null;

                              const isDescription = name === "description";

                              const props = {
                                name: `entries.${index}.${name}`,
                                control,
                                placeholder: isDescription
                                  ? `Missing description`
                                  : `Missing ${name}`,
                              };
                              const Component = isDescription ? Textarea : Text;

                              return <Component key={name} {...props} />;
                            })}
                          </form>
                        </AnimatedDiv>
                        {index < form.fields.length - 1 && (
                          <div className="flex-center">
                            <Divider />
                            <Button
                              text="Swap"
                              endIcon={<BiMoveVertical />}
                              onClick={() => form.swap(index, index + 1)!}
                              className="flex-y px-5"
                            />
                            <Divider />
                          </div>
                        )}
                      </Fragment>
                    ))}
                  </>
                )}
              </ArrayFormContext>
              <footer className="border-top flex-center py-5">
                <SaveButton
                  isSuccess={isSuccess}
                  isLoading={userUpdating}
                  disabled={!formState.isDirty}
                  reset={resetCache}
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
