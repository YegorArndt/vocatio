import { Fragment, useState } from "react";
import { BiEdit } from "react-icons/bi";
import { BsSave2Fill } from "react-icons/bs";
import { GiCancel } from "react-icons/gi";
import { IoArrowRedoSharp } from "react-icons/io5";
import { toast } from "sonner";
import { BlurImage, Spinner } from "~/components";
import { AnimatedDiv } from "~/components/AnimatedDiv";
import { Checkmark, Gpt } from "~/components/icons";
import { Button } from "~/components/ui/buttons/Button";
import { Link } from "~/components/ui/buttons/Link";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "~/components/ui/external/Accordion";
import { Textarea } from "~/components/ui/inputs/Textarea";
import { stripHtmlTags } from "~/modules/utils";
import { api, cn } from "~/utils";
import { FormContext } from "../FormContext";

const { log } = console;

export const LeftEnhanceBox = () => {
  return (
    <section className="flex flex-col gap-3 rounded-md border p-5">
      <h6 className="text-lg">
        Best practices for experience section (opinionated)
      </h6>
      <p className="clr-ghost">
        Your accomplishments need to be translated into the common language
        everyone understands. The AI automatically follows these best practices
        to compose your experience section.
      </p>
      <div className="flex flex-col gap-2">
        {["Concise bullet points", "Skills first"].map((practice) => (
          <div key={practice} className="flex-y my-3 gap-2 text-sm">
            <Checkmark />
            {practice}
          </div>
        ))}
        {[
          {
            practice: "Stress impact",
            from: "significantly reduced costs",
            to: "reduced costs by 50% from $100,000 to $50,000",
          },
          {
            practice: "Exaggerate",
            from: "developed a blog website",
            to: "developed a blog website, attracting over 50,000 monthly visits, boosting the company's online presence.",
          },
        ].map(({ practice, from, to }, i) => (
          <Accordion key={practice} type="single" collapsible>
            <AccordionItem value="i">
              <header className="flex-y gap-2">
                <AccordionTrigger
                  className="flex-y gap-2 text-sm"
                  arrowSize={10}
                >
                  <Checkmark /> {practice}
                </AccordionTrigger>
              </header>
              <AccordionContent className="grid grid-cols-2 items-center rounded-md bg-card !p-3">
                <div className="flex-between">
                  {from}
                  <IoArrowRedoSharp />
                </div>
                <div className="px-5">{to}</div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}
      </div>
    </section>
  );
};

export const RightEnhanceBox = () => {
  const { data: user } = api.users.get.useQuery();

  return (
    <section className="flex flex-col gap-3 rounded-md border p-5">
      <h6 className="flex-y gap-2 text-lg">
        <BlurImage src="/premium.png" />
        Premium feature. Available enhancements:{" "}
        {user ? (
          <span className="clr-red">{user?.enhancementsCount}</span>
        ) : (
          <Spinner size={12} />
        )}
      </h6>
      <p className="clr-ghost">
        Vocatio runs an expensive{" "}
        <Link
          text="GPT-4"
          to="https://openai.com/research/gpt-4"
          newTab
          className="clr-ghost-muted hover:ghost-hover underline"
        />{" "}
        AI model to enhance your experience.
      </p>
      <p className="clr-ghost mt-auto">
        If you run out of enhancements, please consider{" "}
        <Link
          text="upgrading to Premium"
          to="/vacancies"
          className="clr-ghost-muted hover:ghost-hover underline"
        />
        .{" "}
      </p>
    </section>
  );
};

const insertNewLineAtBullet = (str: string) => {
  const regex = /•/g;
  return str.replace(regex, "\n•");
};

export const EnhancementResult = () => {
  const [isEditing, setIsEditing] = useState(false);

  const { data: user, refetch: refetchUser } = api.users.get.useQuery();

  const {
    mutate: generateEnhancedExperience,
    isLoading: isGenerating,
    isSuccess: isSuccessGenerating,
  } = api.users.generateEnhancedExperience.useMutation({
    onSuccess: () => {
      refetchUser();
      toast.dismiss();
      toast.success("Enhanced. Please review.");
    },
  });

  const { mutate: updateUser, isLoading: isUpdating } =
    api.users.update.useMutation({
      onSuccess: () => {
        setIsEditing(false);
        toast.success("Enhanced description updated");
      },
      onError: () => {
        toast.error("Failed to update");
      },
    });

  const hasData = !!user?.experience[0]?.enhancedDescription;

  const updateEnhancedDescription = (
    data: Record<string, string | undefined>
  ) => {
    if (!user) return;

    const updatedExperience = user.experience.map((x) => {
      if (data[x.id]) return { ...x, enhancedDescription: data[x.id] };
      return x;
    });

    updateUser({
      experience: updatedExperience,
    });
  };

  return (
    <Fragment>
      <footer className="flex-center my-5">
        <Button
          frontIcon={<Gpt />}
          text="Enhance my experience"
          className="primary sm"
          disabled={!user || user.enhancementsCount < 1 || isGenerating}
          onClick={() => {
            toast.loading("Enhancing...", { duration: Infinity });
            void generateEnhancedExperience();
          }}
        />
      </footer>
      <section
        className={cn("mt-11 flex flex-col overflow-auto", {
          invisible: !hasData,
        })}
      >
        {user!.experience.map((x, i) => (
          <div key={i} className="flex flex-col gap-6">
            <header className="flex-center gap-6">
              <BlurImage
                src={x.image}
                height={40}
                width={40}
                className="rounded-full"
                fallback={<BlurImage src="/loading-cat.gif" />}
              />
              <h6 className="text-lg">{x.place}</h6>
            </header>
            <div className="grid h-full grid-cols-2 gap-3">
              <AnimatedDiv className="flex-y gap-4">
                <div className="whitespace-pre-wrap rounded-md border p-5 leading-7">
                  {insertNewLineAtBullet(x.description)}
                </div>
                <IoArrowRedoSharp className="shrink-0" size={20} />
              </AnimatedDiv>
              {hasData ? (
                <FormContext
                  form={{
                    defaultValues: {
                      [x.id]: insertNewLineAtBullet(x.enhancedDescription!),
                    },
                  }}
                >
                  {({ control, formState }, submit) => (
                    <>
                      {isEditing && (
                        <AnimatedDiv className="h-full grow whitespace-pre-wrap p-5">
                          <Textarea
                            control={control}
                            name={x.id}
                            className="!h-full"
                            textareaClassName="!h-full"
                          />
                        </AnimatedDiv>
                      )}
                      {!isEditing && (
                        <AnimatedDiv className="whitespace-pre-wrap rounded-md border p-5 leading-7">
                          {insertNewLineAtBullet(
                            stripHtmlTags(x.enhancedDescription!).trim()
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
                              void submit(updateEnhancedDescription);
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
              ) : (
                <div className="skeleton size-full" />
              )}
            </div>
          </div>
        ))}
      </section>
    </Fragment>
  );
};
