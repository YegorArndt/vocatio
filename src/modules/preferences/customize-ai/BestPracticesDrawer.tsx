import { useState } from "react";
import { BiEdit } from "react-icons/bi";
import { BlurImage, Spinner } from "~/components";
import { Button } from "~/components/ui/buttons/Button";
import {
  DrawerContent,
  Drawer,
  DrawerHandle,
  DrawerTrigger,
} from "~/components/ui/external/Drawer";
import { usePersistentData } from "~/hooks/usePersistentData";
import { AFTER_GREEN, BEFORE_RED } from "~/modules/constants";
import { stripHtmlTags } from "~/modules/utils";
import { api, cn } from "~/utils";
import { FormContext } from "../my-info/FormContext";
import { Textarea } from "~/components/ui/inputs/Textarea";
import { AnimatedDiv } from "~/components/AnimatedDiv";
import { BsSave2Fill } from "react-icons/bs";
import { GiCancel } from "react-icons/gi";
import { toast } from "sonner";

const { log } = console;

const insertNewLineAtBullet = (str: string) => {
  const regex = /•/g;
  return str.replace(regex, "\n•");
};

export const BestPracticesDrawer = () => {
  const { ls, updateLs } = usePersistentData();
  const [isEditing, setIsEditing] = useState(false);

  const { mutate: updateUser, isLoading: isUpdating } =
    api.users.update.useMutation({
      onSuccess: () => {
        setIsEditing(false);
        toast.success("Optimized description updated");
      },
      onError: () => {
        toast.error("Failed to update");
      },
    });

  const updateShadowDescription = (
    data: Record<string, string | undefined>
  ) => {
    if (!ls.user) return;

    const updatedExperience = ls.user.experience.map((x) => {
      if (data[x.id]) return { ...x, shadowDescription: data[x.id] };
      return x;
    });

    updateUser({
      // @ts-ignore TODO: dates
      experience: updatedExperience,
    });
    updateLs({
      user: {
        ...ls.user,
        // @ts-ignore TODO: dates
        experience: updatedExperience,
      },
    });
  };

  const disabled = !ls.user?.experience?.[0]?.shadowDescription;

  return (
    <Drawer>
      <DrawerTrigger
        className="primary sm w-min whitespace-nowrap"
        disabled={disabled}
      >
        🔥 See how it looks on your experience
      </DrawerTrigger>
      {!disabled && (
        <DrawerContent className="max-h-[95vh] bg-primary px-10 py-5">
          <DrawerHandle />
          <div className="flex h-full flex-col gap-8 overflow-auto">
            {ls.user!.experience.map((x, i) => (
              <section key={i}>
                <header className="flex-center gap-3">
                  <BlurImage
                    src={x.image}
                    height={40}
                    width={40}
                    className="rounded-full"
                    fallback={<BlurImage src="/loading-cat.gif" />}
                  />
                  <h6 className="text-lg">{x.place}</h6>
                </header>
                <div className="grid h-full grid-cols-2 gap-8 p-5">
                  <AnimatedDiv
                    className={cn(BEFORE_RED, "whitespace-pre-wrap")}
                  >
                    {insertNewLineAtBullet(x.description)}
                  </AnimatedDiv>
                  <FormContext
                    form={{
                      defaultValues: {
                        [x.id]: x.shadowDescription
                          ?.replaceAll("•", "\n•")
                          .trim(),
                      },
                    }}
                  >
                    {({ control, formState }, submit) => (
                      <>
                        {isEditing && (
                          <AnimatedDiv>
                            <Textarea
                              control={control}
                              name={x.id}
                              className="!h-full"
                              textareaClassName="!h-full"
                            />
                          </AnimatedDiv>
                        )}
                        {!isEditing && (
                          <AnimatedDiv
                            className={cn(
                              AFTER_GREEN,
                              "whitespace-pre-wrap !pt-0"
                            )}
                          >
                            {insertNewLineAtBullet(
                              stripHtmlTags(x.shadowDescription!).trim()
                            )}
                          </AnimatedDiv>
                        )}
                        <footer className="flex-y col-span-2 justify-end gap-3">
                          {isEditing && (
                            <Button
                              frontIcon={
                                isUpdating ? (
                                  <Spinner size={12} />
                                ) : (
                                  <BsSave2Fill />
                                )
                              }
                              text="Save"
                              className="primary sm"
                              onClick={() => {
                                void submit(updateShadowDescription);
                              }}
                              disabled={!formState.isDirty || isUpdating}
                            />
                          )}
                          <Button
                            frontIcon={isEditing ? <GiCancel /> : <BiEdit />}
                            text={isEditing ? "Cancel" : "Edit"}
                            baseCn="sm flex-y rounded-md"
                            className={cn({
                              "primary sm": !isEditing,
                              "bg-red clr-white": isEditing,
                            })}
                            onClick={() => setIsEditing(!isEditing)}
                          />
                        </footer>
                      </>
                    )}
                  </FormContext>
                </div>
              </section>
            ))}
          </div>
        </DrawerContent>
      )}
    </Drawer>
  );
};
