import { BlurImage, Spinner } from "~/components";
import { Button } from "~/components/ui/buttons/Button";
import { FormContext } from "../../../../../components/FormContext";
import { ArrayFormContext } from "../../ArrayFormContext";
import { Fragment, useState } from "react";
import { BiCopy, BiMoveVertical } from "react-icons/bi";
import { Divider } from "~/components/layout/Divider";
import { ExperienceEntry } from "@prisma/client";
import { Gpt, Thunder } from "~/components/icons";
import { api, cn } from "~/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/external/Popover";
import { CiImageOn } from "react-icons/ci";
import {
  Tooltip,
  TooltipTrigger,
  TooltipProvider,
} from "@radix-ui/react-tooltip";
import { TooltipContent } from "~/components/ui/external/Tooltip";
import { AnimatedDiv } from "~/components/AnimatedDiv";
import { Text } from "~/components/ui/inputs/Text";
import { uuidv4 } from "~/modules/utils";
import { TiTimes } from "react-icons/ti";
import { RiDeleteBin2Fill } from "react-icons/ri";
import { TbRestore } from "react-icons/tb";
import { Textarea } from "~/components/ui/inputs/Textarea";
import { HiPlusCircle } from "react-icons/hi2";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "~/components/ui/external/Tabs";
import { IoNewspaper } from "react-icons/io5";
import { toast } from "sonner";

const { log } = console;

type ExperienceBoxProps = {
  data: {
    experience: ExperienceEntry[];
  };
  update: (data: any) => void;
  isUpdating: boolean;
  boxName: string;
};

const ImagePicker = (props: {
  image?: string;
  onClick: (image: string) => void;
}) => {
  const { image: initialImage, onClick } = props;
  const [image, setImage] = useState<string | undefined>(initialImage);
  const { data: user } = api.users.get.useQuery();

  if (!user) return <Spinner />;

  const data = user.experience.map((e) => ({
    image: e.image,
    company: e.place,
  }));

  return (
    <Popover>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger className="clr-ghost primary">
              <BlurImage
                src={image}
                width={50}
                height={50}
                className="rounded-md"
                fallback={<CiImageOn fontSize={50} />}
              />
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent>Pick an image</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <PopoverContent className="flex flex-col gap-5" side="left">
        {data.map(
          ({ image, company }) =>
            image && (
              <Button
                key={company}
                text={company}
                frontIcon={<BlurImage src={image} height={50} width={50} />}
                className="primary lg !justify-start"
                onClick={() => {
                  onClick(image);
                  setImage(image);
                }}
              />
            )
        )}
        <Button
          text="Remove image"
          className="clr-red hover:underline"
          onClick={() => {
            setImage(undefined);
            onClick("");
          }}
        />
      </PopoverContent>
    </Popover>
  );
};

type Formatted = ReturnType<typeof format>;

const format = (experience: ExperienceEntry[]) => {
  return experience.map((e) => {
    const { skills, bullets } = e;
    const formattedSkills = skills.map((x) => ({ id: uuidv4(), value: x }));
    const formattedBullets = bullets.map((x) => ({ id: uuidv4(), value: x }));

    return { ...e, skills: formattedSkills, bullets: formattedBullets };
  });
};

const unformat = (experience: Formatted) => {
  return experience.map((e) => {
    const { skills, bullets } = e;
    const unformattedSkills = skills.map((x) => x.value);
    const unformattedBullets = bullets.map((x) => x.value);

    return { ...e, skills: unformattedSkills, bullets: unformattedBullets };
  });
};

export const ExperienceBox = (props: ExperienceBoxProps) => {
  const { data, update, isUpdating } = props;
  const { data: user } = api.users.get.useQuery();

  const defaultValues = {
    experience: format(data.experience),
  };

  const customUpdate = (data: { experience: Formatted }) => {
    const { experience } = data;
    if (!experience) return;

    return update({
      experience: unformat(experience),
    });
  };

  return (
    <FormContext
      form={{
        defaultValues,
      }}
    >
      {({ formState, control, setValue, resetField, watch }, submit) => (
        <Fragment>
          <ArrayFormContext name="experience">
            {({ form }) => (
              <Fragment>
                <header className="mb-8 mt-5 flex justify-end">
                  <Button
                    frontIcon={<HiPlusCircle fontSize={19} />}
                    text="New entry"
                    className="blue-button"
                    onClick={() =>
                      form.prepend({
                        place: "Company name",
                        title: user?.jobTitle || "",
                      })
                    }
                  />
                </header>
                {form.fields.map((field, index) => (
                  <Fragment key={field.id}>
                    <AnimatedDiv>
                      <header className="flex-y w-full gap-5">
                        <ImagePicker
                          image={field.image}
                          onClick={(image) => {
                            setValue(`experience.${index}.image`, image, {
                              shouldDirty: true,
                            });
                          }}
                        />
                        <section className="grid w-full grid-cols-2 gap-11">
                          <div className="flex flex-col">
                            <Text
                              name={`experience.${index}.place`}
                              control={control}
                              className="outlined [&>*]:text-lg [&>*]:font-semibold"
                            />
                            <Text
                              name={`experience.${index}.title`}
                              control={control}
                              className="outlined [&>*]:italic"
                            />
                          </div>
                          <div className="flex flex-col gap-2">
                            <Text
                              name={`experience.${index}.period`}
                              control={control}
                              className="outlined [&>*]:font-semibold"
                            />
                            <div className="flex-y">
                              <Button
                                frontIcon={<RiDeleteBin2Fill />}
                                text="Delete entry"
                                className="primary sm"
                                onClick={() => form.remove(index)}
                              />
                              <Button
                                frontIcon={<TbRestore />}
                                text="Restore defaults"
                                className="primary sm"
                                onClick={() =>
                                  resetField(`experience.${index}`)
                                }
                              />
                            </div>
                          </div>
                        </section>
                      </header>
                      <section className="col-span-2 my-5 flex flex-col gap-3">
                        <ArrayFormContext name={`experience.${index}.skills`}>
                          {(formattedSkills) => {
                            const { form: skillsForm } = formattedSkills;

                            return (
                              <>
                                <header className="flex-between">
                                  <div className="flex-y gap-2">
                                    <Thunder />
                                    Skills demonstrated at this role
                                  </div>
                                  <Button
                                    frontIcon={<HiPlusCircle fontSize={19} />}
                                    text="New skill"
                                    className="blue-button"
                                    onClick={() => {
                                      skillsForm.prepend({
                                        id: uuidv4(),
                                        value: "New skill",
                                      });
                                    }}
                                  />
                                </header>
                                <div className="flex flex-wrap gap-2">
                                  <TooltipProvider>
                                    {skillsForm.fields.map((field, i) => {
                                      const name = `experience.${index}.skills.${i}.value`;
                                      // @ts-ignore
                                      const value = watch(name);

                                      return (
                                        <Tooltip key={field.id}>
                                          <TooltipTrigger asChild>
                                            <AnimatedDiv className="flex gap-3 rounded-full bg-primary">
                                              <Text
                                                name={name}
                                                control={control}
                                                className="!rounded-full !bg-transparent"
                                                adornment={
                                                  <Tooltip>
                                                    <TooltipTrigger
                                                      className="mx-2 w-[15px] hover:clr-white"
                                                      onClick={() =>
                                                        skillsForm.remove(i)
                                                      }
                                                    >
                                                      <TiTimes />
                                                    </TooltipTrigger>
                                                  </Tooltip>
                                                }
                                              />
                                            </AnimatedDiv>
                                          </TooltipTrigger>
                                          {(value as any)?.length > 19 && (
                                            <TooltipContent>
                                              {value as any}
                                            </TooltipContent>
                                          )}
                                        </Tooltip>
                                      );
                                    })}
                                  </TooltipProvider>
                                </div>
                              </>
                            );
                          }}
                        </ArrayFormContext>

                        <Tabs
                          defaultValue="original"
                          className="mt-5 flex flex-col items-start gap-3"
                        >
                          <TabsList className="flex-y gap-4">
                            <h5
                              className={cn("flex-y gap-2", {
                                "after:ml-2 after:rounded-md after:bg-dark-yellow after:p-1 after:content-['If_left_empty,_the_AI_creates_a_description_based_on_the_vacancy_responsibilities.'] after:clr-white":
                                  !watch(`experience.${index}.description`)
                                    ?.length,
                              })}
                            >
                              <IoNewspaper />
                              <span
                                className={cn({
                                  "wave-warning": !watch(
                                    `experience.${index}.description`
                                  )?.length,
                                })}
                              >
                                Role description
                              </span>
                            </h5>
                            <div>
                              <TabsTrigger value="original">
                                Original
                              </TabsTrigger>
                              <TabsTrigger value="processed">
                                Processed by Vocatio
                              </TabsTrigger>
                            </div>
                          </TabsList>
                          <TabsContent value="original" className="w-full">
                            <Textarea
                              control={control}
                              name={`experience.${index}.description`}
                            />
                          </TabsContent>
                          <TabsContent value="processed" className="w-[90%]">
                            <ArrayFormContext
                              name={`experience.${index}.bullets`}
                            >
                              {({ form: bulletsForm }) => {
                                const { fields } = bulletsForm;

                                if (!fields.length)
                                  return (
                                    <Button
                                      frontIcon={<Gpt />}
                                      text="Process"
                                      className="primary sm"
                                    />
                                  );

                                return (
                                  <section className="flex w-full flex-col gap-3">
                                    <header className="flex-y gap-3">
                                      <Button
                                        frontIcon={<BiCopy />}
                                        text="Copy bullets as text"
                                        onClick={() => {
                                          const bullets = fields
                                            .map((field) => `• ${field.value}`)
                                            .join("\n");
                                          navigator.clipboard.writeText(
                                            bullets
                                          );
                                          toast.success("Copied to clipboard");
                                        }}
                                        className="primary sm w-min"
                                      />
                                      <Button
                                        text="New bullet"
                                        frontIcon={
                                          <HiPlusCircle fontSize={19} />
                                        }
                                        className="blue-button"
                                        onClick={() =>
                                          bulletsForm.prepend({
                                            id: uuidv4(),
                                            value: "Bullet",
                                          })
                                        }
                                      />
                                    </header>
                                    {fields.map((field, i) => (
                                      <AnimatedDiv
                                        key={field.id}
                                        className="flex gap-3 rounded-full bg-primary"
                                      >
                                        <Text
                                          control={control}
                                          name={`experience.${index}.bullets.${i}.value`}
                                          className="!rounded-full !bg-transparent before:mr-2 before:content-['•'] before:clr-weiss"
                                          adornment={
                                            <Button
                                              className="mx-2 w-[15px] hover:clr-white"
                                              onClick={() =>
                                                bulletsForm.remove(i)
                                              }
                                            >
                                              <TiTimes />
                                            </Button>
                                          }
                                        />
                                      </AnimatedDiv>
                                    ))}
                                  </section>
                                );
                              }}
                            </ArrayFormContext>
                            <footer className="flex-y mb-3 mt-8 gap-2">
                              <Thunder />
                              We strongly recommend keeping the bullet points
                              concise.
                            </footer>
                          </TabsContent>
                        </Tabs>
                      </section>
                    </AnimatedDiv>
                    {index < form.fields.length - 1 && (
                      <div className="flex-center py-8">
                        <Divider className="!h-2 rounded-full" />
                        <Button
                          text="Swap"
                          endIcon={<BiMoveVertical />}
                          onClick={() => form.swap(index, index + 1)!}
                          className="flex-y px-5"
                        />
                        <Divider className="!h-2 rounded-full" />
                      </div>
                    )}
                  </Fragment>
                ))}
              </Fragment>
            )}
          </ArrayFormContext>
          <footer className="border-top flex-between col-span-2 mt-8 w-full gap-3 py-4">
            <div className="clr-ghost flex-y gap-2">
              <Thunder />
              Vocatio automatically streamlines your experience to align with
              modern best practices.
            </div>
            <Button
              frontIcon={isUpdating && <Spinner size={10} />}
              text={isUpdating ? "Updating..." : "Update"}
              onClick={() => void submit(customUpdate)}
              className="primary-filled sm flex-y ml-auto"
              disabled={isUpdating || !formState.isDirty}
            />
          </footer>
        </Fragment>
      )}
    </FormContext>
  );
};
