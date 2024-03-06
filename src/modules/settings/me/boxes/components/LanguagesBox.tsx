import { FormContext } from "../../../../../components/FormContext";
import { ArrayFormContext } from "../../ArrayFormContext";
import { AnimatedDiv } from "~/components/AnimatedDiv";
import { Button } from "~/components/ui/buttons/Button";
import { Spinner } from "~/components";
import { BoxName } from "../../types";
import { Fragment, useState } from "react";
import { Text } from "~/components/ui/inputs/Text";
import { LanguageEntry } from "@prisma/client";
import { RiDeleteBin2Fill } from "react-icons/ri";
import { BiMoveVertical } from "react-icons/bi";
import { Divider } from "~/components/layout/Divider";
import { Thunder } from "~/components/icons";
import { HiPlusCircle } from "react-icons/hi2";

const { log } = console;

type EntryBoxProps = {
  data: LanguageEntry[];
  update: (data: any) => void;
  isUpdating: boolean;
  boxName: BoxName;
  isStubby?: boolean;
};

const languages = [
  "English",
  "Spanish",
  "German",
  "French",
  "Russian",
  "Italian",
  "Portuguese",
  "Dutch",
  "Swedish",
  "Norwegian",
  "Danish",
  "Ukranian",
  "Polish",
  "Czech",
  "Slovak",
  "Slovenian",
  "Hungarian",
  "Hindi",
];

const guessLanguage = (fields: LanguageEntry[]) => {
  const included = fields.map((field) => field.name);
  const next = languages.find((lang) => !included.includes(lang));
  return next || "Language";
};

export const LanguagesBox = (props: EntryBoxProps) => {
  const { data, update, isUpdating, boxName } = props;
  const [filter, setFilter] = useState("");

  return (
    <section>
      <FormContext
        form={{
          defaultValues: data,
        }}
      >
        {({ formState, control }, submit) => {
          return (
            <>
              <ArrayFormContext name={boxName}>
                {({ form }) => (
                  <>
                    <header className="flex-y border-bottom group mb-5 gap-8 pb-1">
                      <input
                        type="text"
                        placeholder="Type to filter"
                        value={filter}
                        className="w-full bg-transparent p-2 focus:outline-none"
                        onChange={(e) => setFilter(e.target.value)}
                        autoFocus
                      />
                      <Button
                        frontIcon={<HiPlusCircle />}
                        text="New language"
                        onClick={() => {
                          form.prepend({
                            // @ts-ignore
                            name: guessLanguage(form.fields),
                            value: "Expert",
                          });
                        }}
                        className="flex-y sm whitespace-nowrap rounded-md bg-blue font-semibold"
                      />
                    </header>
                    <div className="flex flex-col gap-3">
                      {form.fields.map((field, index) => {
                        const name = `${boxName}.${index}.name`;
                        const value = `${boxName}.${index}.value`;

                        return (
                          <Fragment key={field.id}>
                            <AnimatedDiv className="grid grid-cols-2 gap-5">
                              <Text
                                control={control}
                                name={name}
                                className="!bg-primary"
                              />
                              <div className="flex-y gap-3">
                                <Text
                                  control={control}
                                  name={value}
                                  className="!bg-primary"
                                />
                                <Button
                                  className="primary sm"
                                  onClick={() => form.remove(index)}
                                >
                                  <RiDeleteBin2Fill />
                                </Button>
                              </div>
                            </AnimatedDiv>
                            {index < form.fields.length - 1 && (
                              <div className="flex-center">
                                <Divider />
                                <Button
                                  endIcon={<BiMoveVertical />}
                                  onClick={() => form.swap(index, index + 1)!}
                                  className="flex-y px-5"
                                />
                                <Divider />
                              </div>
                            )}
                          </Fragment>
                        );
                      })}
                    </div>
                  </>
                )}
              </ArrayFormContext>
              <footer className="border-top flex-between col-span-2 mt-8 w-full gap-3 py-4">
                <div className="clr-ghost flex-y gap-2">
                  <Thunder />
                  All specified languages will be included in your resume.
                </div>
                <Button
                  frontIcon={isUpdating && <Spinner size={10} />}
                  text={isUpdating ? "Updating..." : "Update"}
                  onClick={() =>
                    void submit((data) => {
                      update({
                        // @ts-ignore
                        [boxName]: data[boxName].filter(
                          (item: any) => item.name !== ""
                        ),
                      });
                    })
                  }
                  className="sm primary-filled ml-auto"
                  disabled={isUpdating || !formState.isDirty}
                />
              </footer>
            </>
          );
        }}
      </FormContext>
    </section>
  );
};
