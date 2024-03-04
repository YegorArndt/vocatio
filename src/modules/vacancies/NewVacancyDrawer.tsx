import { SlMagnifier } from "react-icons/sl";
import {
  DrawerContent,
  Drawer,
  DrawerHandle,
  DrawerTrigger,
} from "~/components/ui/external/Drawer";
import { api } from "~/utils";
import { useRouter } from "next/router";
import { BsPlusCircleDotted } from "react-icons/bs";
import { Thunder } from "~/components/icons";
import { Textarea } from "~/components/ui/inputs/Textarea";
import { useForm } from "react-hook-form";
import { Button } from "~/components/ui/buttons/Button";
import { IoSparklesSharp } from "react-icons/io5";
import { toast } from "sonner";
import { uuidv4 } from "../utils";
import { tailor } from "../create/tailor";
import { MessageContainer } from "~/components/MessageContainer";
import { useState } from "react";
import { AnimatedDiv } from "~/components/AnimatedDiv";
import { Spinner } from "~/components";

const { log } = console;

export const NewVacancyDrawer = () => {
  const { data: user } = api.users.get.useQuery();
  const router = useRouter();
  const [startedTailoring, setStartedTailoring] = useState(false);

  const defaultValues = {
    description: "",
  };

  const { control, formState, handleSubmit } = useForm({
    defaultValues,
  });

  const onSubmit = (data: typeof defaultValues) => {
    if (!user) return;

    const { description } = data;

    if (description.length < 120) {
      toast.error("Description must be at least 120 characters long.");
      return;
    }

    const vacancy = {
      id: uuidv4(),
      description,
    };

    setStartedTailoring(true);
    // @ts-ignore
    void tailor({ vacancy, user }).then(() => {
      setStartedTailoring(false);
      router.push(`/create/${vacancy.id}`);
    });
  };

  return (
    <Drawer>
      <DrawerTrigger className="blue-button ml-auto gap-2">
        <BsPlusCircleDotted />
        New vacancy
      </DrawerTrigger>
      <DrawerContent className="h-max bg-primary px-10 pb-[150px] pt-5">
        <DrawerHandle />
        <header>
          <h5 className="text-lg">
            Just copy and paste the vacancy description.
          </h5>
          <span className="clr-ghost flex-y gap-2">
            <Thunder />
            Tip: first check whether the extension can do it automatically for
            you.
          </span>
        </header>
        <section className="my-5 grid grid-cols-2 gap-5">
          <div className="flex flex-col gap-4">
            <Textarea
              name="description"
              control={control}
              placeholder="Vacancy description"
              rows={15}
              className="[&>*]:resize-none"
            />
            <Button
              frontIcon={<IoSparklesSharp />}
              text="Tailor my CV to it"
              className="blue-button w-min"
              disabled={!formState.dirtyFields.description}
              onClick={handleSubmit(onSubmit)}
            />
          </div>
          {startedTailoring && (
            <MessageContainer className="flex-center">
              <AnimatedDiv duration={2} className="flex-y gap-3">
                <SlMagnifier />
                Analyzing the vacancy...
              </AnimatedDiv>
              <AnimatedDiv duration={2} className="flex-y gap-3">
                <SlMagnifier />
                Identifying the keywords...
              </AnimatedDiv>
              <AnimatedDiv duration={1000} className="flex-y gap-3">
                <Spinner size={10} />
                Preparing your CV...
              </AnimatedDiv>
            </MessageContainer>
          )}
        </section>
      </DrawerContent>
    </Drawer>
  );
};
