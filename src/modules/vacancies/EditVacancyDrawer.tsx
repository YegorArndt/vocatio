// @ts-nocheck

import { v4 as uuidv4 } from "uuid";
import { Vacancy } from "@prisma/client";
import { startCase } from "lodash-es";
import { ReactNode } from "react";
import {
  DrawerContent,
  Drawer,
  DrawerHandle,
} from "~/components/ui/external/Drawer";
import { SaveButton } from "~/components/SaveButton";
import { LiaEditSolid } from "react-icons/lia";
import { useForm } from "react-hook-form";
import { normalizeHookFormValues } from "../settings/me/FormContext";
import { Textarea } from "~/components/ui/inputs/Textarea";
import { Text } from "~/components/ui/inputs/Text";
import { initDraft } from "../init-gen/utils";
import { api } from "~/utils";
import { PartialVacancy } from "../types";
import { useRouter } from "next/router";

const { log } = console;

type EditVacancyDrawerProps = {
  heading: ReactNode;
  trigger: ReactNode;
  vacancy?: Vacancy;
  onClick?: (vacancy: Vacancy) => void;
  isCreate?: boolean;
};

type EditableVacancy = Pick<
  Vacancy,
  | "companyName"
  | "salaryCurrency"
  | "salaryMin"
  | "salaryMax"
  | "location"
  | "jobTitle"
  | "employmentType"
  | "requiredSeniority"
  | "sourceName"
  | "sourceUrl"
  | "description"
>;

const editableFields: (keyof EditableVacancy)[] = [
  "companyName",
  "jobTitle",
  "location",
  "salaryMin",
  "salaryMax",
  "salaryCurrency",
  "employmentType",
  "requiredSeniority",
  "sourceName",
  "sourceUrl",
];

const stubbyVacancy = editableFields.reduce(
  (acc, key) => ({ ...acc, [key]: "" }),
  { description: "", id: uuidv4() }
);

export const EditVacancyDrawer = (props: EditVacancyDrawerProps) => {
  const {
    heading,
    trigger,
    vacancy = stubbyVacancy,
    onClick,
    isCreate,
  } = props;

  const { data: user } = api.users.get.useQuery();

  const router = useRouter();

  const {
    control,
    formState,
    watch,
    handleSubmit,
    reset: resetForm,
  } = useForm({
    defaultValues: normalizeHookFormValues(vacancy),
  });

  const onCreate = (vacancy: PartialVacancy) => {
    if (!user) return;

    void initDraft({
      vacancy,
      user,
      onComplete: () => router.push(`/create/${vacancy.id}`),
    });
  };

  return (
    <Drawer>
      {trigger}
      <DrawerContent className="bg-primary px-10 py-5">
        <DrawerHandle />
        <div className="flex flex-col gap-8 ">
          <header className="flex-between text-xl">
            {heading}
            <SaveButton
              // isLoading={isLoading}
              // isSuccess={isSuccess}
              frontIcon={<LiaEditSolid />}
              text={isCreate ? "Create vacancy" : "Update vacancy"}
              className="w-[200px]"
              onClick={handleSubmit(onCreate)}
              // disabled={
              //   isLoading ||
              //   !formState.isDirty ||
              //   watch("description").toString().trim().length === 0
              // }
              // reset={reset}
              // onClick={onSubmit}
            />
          </header>
          <div className="grid min-h-[500px] grid-cols-2 gap-8 bg-primary  ">
            <section className="flex flex-col gap-5">
              {vacancy &&
                editableFields.map((field) => (
                  <div key={field} className="grid grid-cols-[1fr,3fr]">
                    <label htmlFor={field}>{startCase(field)}</label>
                    <Text control={control} name={field} />
                  </div>
                ))}
            </section>
            {vacancy && (
              <label className="flex flex-col gap-2">
                <span className="after:content-['*'] after:clr-red">
                  Description &nbsp;
                </span>
                <Textarea
                  control={control}
                  name="description"
                  className="col-span-2"
                  textareaClassName="h-[500px]"
                  required
                  minLength={500}
                />
              </label>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
