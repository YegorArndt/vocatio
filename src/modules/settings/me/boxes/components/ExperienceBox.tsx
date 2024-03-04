import { BlurImage, Spinner } from "~/components";
import { Button } from "~/components/ui/buttons/Button";
import { FormContext } from "../../../../../components/FormContext";
import { ArrayFormContext } from "../../ArrayFormContext";
import { Fragment } from "react";
import { LuCopyPlus } from "react-icons/lu";
import { RiDeleteBin6Line } from "react-icons/ri";
import { TbRestore } from "react-icons/tb";
import { AnimatedDiv } from "~/components/AnimatedDiv";
import { Textarea } from "~/components/ui/inputs/Textarea";
import { Text } from "~/components/ui/inputs/Text";
import { BiMoveVertical } from "react-icons/bi";
import { Divider } from "~/components/layout/Divider";
import { typedKeys } from "~/modules/utils";
import { ExperienceEntry } from "@prisma/client";
import { Thunder } from "~/components/icons";
import { api } from "~/utils";
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
  const { image, onClick } = props;
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
                width={100}
                height={100}
                className="rounded-md"
                fallback={<CiImageOn fontSize={40} />}
              />
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent>Pick an image</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <PopoverContent className="flex flex-col gap-5">
        {data.map(
          ({ image, company }) =>
            image && (
              <Button
                key={company}
                text={company}
                frontIcon={<BlurImage src={image} height={50} width={50} />}
                className="primary lg !justify-start"
                onClick={() => onClick(image)}
              />
            )
        )}
      </PopoverContent>
    </Popover>
  );
};

export const ExperienceBox = (props: ExperienceBoxProps) => {
  const { data, update, isUpdating } = props;

  const defaultValues = {
    experience: data.experience,
  };

  const customUpdate = (data: ExperienceBoxProps["data"]) => {
    const { experience } = data;

    if (!experience) return;

    const formattedForServer = experience.map((e) => {
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
      experience: formattedForServer,
    });
  };

  return (
    <FormContext
      form={{
        defaultValues,
      }}
    >
      {(
        { formState, control, resetField, setValue, getValues },
        submit,
        updateDefaults
      ) => (
        <Fragment>
          <ArrayFormContext name="experience">
            {({ form }) => (
              <Fragment>
                {form.fields.map((field, index) => (
                  <Fragment key={field.id}>
                    <AnimatedDiv className="grid grid-cols-[1fr_2fr] gap-4">
                      <section className="flex-y w-full gap-4">
                        <ImagePicker
                          image={field.image}
                          onClick={(image) => {
                            setValue(`experience.${index}.image`, image);
                            updateDefaults(getValues());
                          }}
                        />
                        <div className="flex grow flex-col gap-4">
                          <Text
                            name={`experience.${index}.place`}
                            control={control}
                          />
                          <div role="toolbar" className="flex-y gap-4">
                            {[
                              {
                                icon: <RiDeleteBin6Line fontSize={18} />,
                                onClick: () => form.remove(index),
                              },
                              {
                                icon: <LuCopyPlus fontSize={18} />,
                                onClick: () => form.insert(index + 1, field),
                              },
                              {
                                icon: <TbRestore fontSize={18} />,
                                onClick: () =>
                                  //@ts-ignore
                                  resetField(`experience.${index}`),
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
                            "createdAt",
                            "updatedAt",
                            "userId",
                          ].includes(name);

                          if (!shouldRender) return null;

                          const props = {
                            name: `experience.${index}.${name}`,
                            control,
                            placeholder: `Missing ${name}`,
                          };

                          const Component =
                            name === "description" ? Textarea : Text;

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
