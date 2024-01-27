import { v4 as uuidv4 } from "uuid";
import { Currency, Vacancy } from "@prisma/client";
import { pickBy, startCase } from "lodash-es";
import { ReactNode } from "react";
import { useForm } from "react-hook-form";
import {
  DrawerContent,
  Drawer,
  DrawerHandle,
} from "~/components/ui/external/Drawer";
import { Text } from "~/components/ui/inputs/Text";
import { Textarea } from "~/components/ui/inputs/Textarea";
import { api } from "~/utils";
import { normalizeHookFormValues } from "../preferences/my-info/FormContext";
import { SaveButton } from "~/components/SaveButton";
import { LiaEditSolid } from "react-icons/lia";

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

const extractSalaryDetails = (text: string) => {
  let regex = /\$(\d+(?:,\d{3})*)(?:-(\d+(?:,\d{3})*))?/;
  let match = text.match(regex);

  if (!match) {
    // If no match with $, look for the word 'salary' and nearest numbers
    regex = /salary.*?(\d+(?:,\d{3})*)(?:-(\d+(?:,\d{3})*))?/i;
    match = text.match(regex);
  }

  if (match && match[1]) {
    const salaryMin = parseInt(match[1].replace(/,/g, ""), 10).toString();
    const salaryMax = match[2]
      ? parseInt(match[2].replace(/,/g, ""), 10).toString()
      : undefined;
    const salaryCurrency = "USD" as Currency;

    return {
      salaryMin,
      salaryMax,
      salaryCurrency,
    };
  }

  return {};
};

const extractResponsibilities = (text: string) => {
  // Regular expression to match items starting with "- ", bullet points, various types of dashes, or emojis followed by text
  const regex =
    /(-\s|[\u2022\u2013\u2014\u2015]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[^\u0000-\u007F]+)\s*(.*?)(?=\s*(-\s|[\u2022\u2013\u2014\u2015]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[^\u0000-\u007F]+)|\n|$)/gu;

  // Extract matches
  const matches = text.match(regex);

  // Return the captured groups, removing the leading markers
  return matches
    ? matches
        .map((match) =>
          match
            .trim()
            .replace(
              /^(-\s|[\u2022\u2013\u2014\u2015]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[^\u0000-\u007F]+)\s*/,
              ""
            )
        )
        .join(", ")
    : "";
};

const autofillMissing = (updated: EditableVacancy) => {
  const { description } = updated;

  const salary = extractSalaryDetails(description!);
  const requiredSkills = extractResponsibilities(description!);

  return {
    ...updated,
    ...salary,
    requiredSkills,
  };
};

export const EditVacancyDrawer = (props: EditVacancyDrawerProps) => {
  const {
    heading,
    trigger,
    vacancy = stubbyVacancy,
    onClick,
    isCreate,
  } = props;

  const {
    control,
    formState,
    watch,
    handleSubmit,
    reset: resetForm,
  } = useForm({
    defaultValues: normalizeHookFormValues(vacancy),
  });

  const {
    mutate: upsertVacancy,
    isLoading,
    isSuccess,
    reset,
  } = api.vacancies.upsert.useMutation({
    onSuccess: (updated) => {
      resetForm(normalizeHookFormValues(updated));

      /**
       * Start cv generation.
       */
      onClick?.(updated);
    },
  });

  const onSubmit = handleSubmit((data) => {
    const updated = pickBy(
      data,
      (v, k) => editableFields.includes(k as keyof EditableVacancy) && !!v
    );
    updated.description = data.description;

    const { id } = vacancy;

    upsertVacancy({
      id,
      ...autofillMissing(updated as EditableVacancy),
    });
  });

  return (
    <Drawer>
      {trigger}
      <DrawerContent className="bg-primary px-10 py-5">
        <DrawerHandle />
        <div className="flex flex-col gap-8 ">
          <header className="flex-between text-xl">
            {heading}
            <SaveButton
              isLoading={isLoading}
              isSuccess={isSuccess}
              frontIcon={<LiaEditSolid />}
              text={isCreate ? "Create vacancy" : "Update vacancy"}
              className="w-[200px]"
              disabled={
                isLoading ||
                !formState.isDirty ||
                watch("description").toString().trim().length === 0
              }
              reset={reset}
              onClick={onSubmit}
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
