import { startCase } from "lodash-es";
import { api } from "~/utils";
import { Wrapper } from "./Wrapper";
import { FormContext } from "../../FormContext";
import { FineTuneBoxProps } from "../types";
import { LineStack } from "~/components/Spinner";
import { ArrayForm } from "./ArrayForm";
import { SaveButton } from "~/components/SaveButton";
import { SkillEntry } from "@prisma/client";

const { log } = console;

const languages = [
  "chinese",
  "spanish",
  "english",
  "hindi",
  "bengali",
  "portuguese",
  "russian",
  "japanese",
  "punjabi",
  "marathi",
  "telugu",
  "wu chinese",
  "turkish",
  "korean",
  "french",
  "german",
  "vietnamese",
  "tamil",
  "urdu",
  "javanese",
  "italian",
  "egyptian arabic",
  "gujarati",
  "iranian persian",
  "bhojpuri",
  "southern min",
  "hakka",
  "jin chinese",
  "hausa",
  "kannada",
  "indonesian",
  "polish",
  "yoruba",
  "xiang chinese",
  "malayalam",
  "odia",
  "maithili",
  "burmese",
  "eastern punjabi",
  "sunda",
  "sudanese arabic",
  "algerian arabic",
  "moroccan arabic",
  "ukrainian",
  "igbo",
  "northern uzbek",
  "sindhi",
  "north levantine arabic",
  "romanian",
  "tagalog",
  "dutch",
  "sa'idi arabic",
  "gan chinese",
  "amharic",
  "northern pashto",
];

const labelOptions = languages.map((l) => ({
  label: startCase(l),
  value: startCase(l),
}));
const valueOptions = [
  { label: "Intermediate", value: "INTERMEDIATE" },
  { label: "Advanced", value: "ADVANCED" },
  { label: "Expert", value: "EXPERT" },
];
const getFieldArray = (entries: SkillEntry[]) =>
  entries.map((e) => ({
    name: { label: e.name, value: e.name },
    level: { label: e.level, value: e.level },
  }));

export const EntryBox = (props: FineTuneBoxProps) => {
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
    reset,
  } = api.users.update.useMutation();

  const defaultValues = {
    entries: user?.[entryFor] ? getFieldArray(user[entryFor]) : [],
  };

  /**
   * Show skeleton if the user fine-tunes the box for the first time.
   */
  const isHydrating =
    !userLoading && isFetching && defaultValues.entries.length === 0;

  const onSubmit = (values: typeof defaultValues) => {
    const { entries } = values;
    const payload = entries.map((e) => ({
      name: e.name.value,
      level: e.level.value,
    }));

    mutate({
      [entryFor]: payload,
    });
  };

  return (
    <Wrapper entryFor={entryFor}>
      {isHydrating && <LineStack className="w-full gap-5 [&>*]:h-5" />}
      {userLoading && <LineStack className="w-full gap-5 [&>*]:h-5" />}
      {!userLoading && !isHydrating && defaultValues.entries.length > 0 && (
        <FormContext
          form={{
            defaultValues,
          }}
        >
          {({ formState }, submit) => (
            <>
              <ArrayForm
                labelOptions={labelOptions}
                valueOptions={valueOptions}
              />
              <footer className="border-top flex-between w-full py-4">
                <span className="clr-disabled">Add more if you need to.</span>
                <SaveButton
                  isLoading={userUpdating}
                  isSuccess={isSuccess}
                  disabled={!formState.isDirty}
                  reset={reset}
                  onClick={() => submit(onSubmit)}
                />
              </footer>
            </>
          )}
        </FormContext>
      )}
    </Wrapper>
  );
};
