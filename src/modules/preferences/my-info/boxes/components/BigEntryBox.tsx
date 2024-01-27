import { BlurImage, Spinner } from "~/components";
import { BigEntry } from "~/modules/extension/types";
import { Button } from "~/components/ui/buttons/Button";
import { FormContext } from "../../FormContext";
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
import { cn } from "~/utils";

const { log } = console;

//@ts-ignore
const filterForClient = (entries): BigEntry[] => {
  return (
    entries &&
    //@ts-ignore
    entries.map((e) => {
      return omit(e, "id", "createdAt", "updatedAt", "userId");
    })
  );
};

//@ts-ignore
export const BigEntryBox = (props) => {
  const { data, update, isUpdating, boxName } = props;

  const defaultValues = {
    [boxName]: filterForClient(data[boxName]),
  };

  const customUpdate = (data: typeof defaultValues) => {
    const bigEntryArray = data[boxName];

    if (!bigEntryArray) return;

    const formattedForServer = bigEntryArray.map((e) => {
      const { skills } = e;

      if (typeof skills !== "string") return e;

      const formattedSkills = (skills as unknown as string)
        .split(",")
        .map((s) => s.trim())
        .filter((skill) => skill.length > 0);

      return {
        ...e,
        skills: formattedSkills,
      };
    });

    return update({
      [boxName]: formattedForServer,
    });
  };

  return (
    <FormContext
      form={{
        defaultValues,
      }}
    >
      {({ formState, control, resetField }, submit) => (
        <Fragment>
          <ArrayFormContext name={boxName}>
            {({ form }) => (
              <Fragment>
                {form.fields.map((field, index) => (
                  <Fragment key={field.id}>
                    <AnimatedDiv className="grid grid-cols-[1fr_2fr] gap-4">
                      <section className="flex-y w-full gap-4">
                        <BlurImage
                          src={field.image}
                          width={100}
                          height={100}
                          className="rounded-md"
                        />
                        <div className="flex grow flex-col gap-2">
                          <Text
                            name={`${boxName}.${index}.place`}
                            control={control}
                          />
                          <div role="toolbar" className="flex-y gap-2">
                            {[
                              {
                                icon: <RiDeleteBin6Line />,
                                onClick: () => form.remove(index),
                              },
                              {
                                icon: <LuCopyPlus />,
                                onClick: () => form.insert(index + 1, field),
                              },
                              {
                                icon: <TbRestore />,
                                onClick: () =>
                                  //@ts-ignore
                                  resetField(`${boxName}.${index}`),
                              },
                            ].map(({ icon, onClick }, i) => (
                              <Button
                                key={i}
                                onClick={onClick}
                                className="flex-y"
                              >
                                {icon}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </section>
                      <form className="flex flex-col gap-2">
                        {typedKeys(field).map((name, i) => {
                          const shouldRender = ![
                            "place",
                            "image",
                            "id",
                            "shadowDescription",
                          ].includes(name);

                          if (!shouldRender) return null;

                          const props = {
                            name: `${boxName}.${index}.${name}`,
                            control,
                            placeholder: `Missing ${name}`,
                            className: cn(`whitespace-pre-wrap`),
                          };

                          const Component =
                            name === "description" ? Textarea : Text;

                          if (name === "skills") {
                            return (
                              <label className="flex flex-col gap-2">
                                <div className="flex flex-col gap-1 rounded-md border bg-primary p-3">
                                  ❗️ Add as many skills as possible. This will
                                  reflect on the quality of CV tailoring.
                                  <small className="clr-disabled">
                                    If there are different ways of spelling the
                                    same skill, e.g. "REST API" & "Restful API",
                                    consider including both.
                                  </small>
                                </div>
                                <Component key={name} {...props} />
                              </label>
                            );
                          }

                          return <Component key={name} {...props} />;
                        })}
                      </form>
                    </AnimatedDiv>
                    {index < form.fields.length - 1 && (
                      <div className="flex-center py-8">
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
              </Fragment>
            )}
          </ArrayFormContext>
          <footer className="border-top flex-between col-span-2 mt-8 w-full gap-3 py-4">
            <Button
              frontIcon={isUpdating && <Spinner size={10} />}
              text={isUpdating ? "Updating..." : "Update"}
              onClick={() => void submit(customUpdate)}
              className="primary sm flex-y ml-auto"
              disabled={isUpdating || !formState.isDirty}
            />
          </footer>
        </Fragment>
      )}
    </FormContext>
  );
};
