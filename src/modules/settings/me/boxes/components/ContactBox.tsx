import { FormContext } from "../../../../../components/FormContext";
import { ArrayFormContext } from "../../ArrayFormContext";
import { AnimatedDiv } from "~/components/AnimatedDiv";
import { Button } from "~/components/ui/buttons/Button";
import { Spinner } from "~/components";
import { BoxName } from "../../types";
import { Fragment, useState } from "react";
import { Text } from "~/components/ui/inputs/Text";
import { Location, Thunder } from "~/components/icons";
import { SkillEntry } from "@prisma/client";
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
} from "~/components/ui/external/MenuBar";
import { getIcon } from "~/modules/utils";
import { RiDeleteBin2Fill } from "react-icons/ri";
import { BiMoveVertical } from "react-icons/bi";
import { Divider } from "~/components/layout/Divider";
import { HiPlusCircle } from "react-icons/hi2";

const { log } = console;

type EntryBoxProps = {
  data: SkillEntry[];
  update: (data: any) => void;
  isUpdating: boolean;
  boxName: BoxName;
  isStubby?: boolean;
};

const options = [
  "Address",
  "Email",
  "Phone",
  "Github",
  "State",
  "Country",
  "City",
];

export const ContactBox = (props: EntryBoxProps) => {
  const { data, update, isUpdating, boxName } = props;
  const [filter, setFilter] = useState("");

  return (
    <section>
      <FormContext
        form={{
          defaultValues: data,
        }}
      >
        {({ formState, control, watch }, submit) => {
          return (
            <>
              <ArrayFormContext name={boxName}>
                {({ form }) => (
                  <>
                    <header className="flex-y border-bottom mb-5 gap-8 pb-1 focus:border-weiss">
                      <input
                        type="text"
                        placeholder="Type to filter"
                        value={filter}
                        className="w-full bg-transparent p-2 focus:outline-none"
                        onChange={(e) => setFilter(e.target.value)}
                        autoFocus
                      />
                      <Menubar className="clr-card bg-card">
                        <MenubarMenu>
                          <MenubarTrigger className="flex-y sm cursor-pointer gap-2 whitespace-nowrap rounded-md bg-blue font-semibold">
                            <HiPlusCircle />
                            New
                          </MenubarTrigger>
                          <MenubarContent className="max-w-[400px] bg-primary p-3">
                            <input
                              type="text"
                              placeholder="Type to filter"
                              value={filter}
                              className="border-bottom mb-3 w-full bg-transparent p-2 focus:border-weiss focus:outline-none"
                              onChange={(e) => setFilter(e.target.value)}
                            />
                            <section className="flex-y flex-wrap gap-3">
                              {options.map((option) => {
                                return (
                                  <MenubarItem key={option} asChild>
                                    <Button
                                      onClick={() => {
                                        form.append({
                                          name: option,
                                          value: `Enter ${option} here...`,
                                        });
                                      }}
                                      className="flex-y primary sm"
                                      frontIcon={getIcon(option)?.({})}
                                      text={option}
                                    />
                                  </MenubarItem>
                                );
                              })}
                              <MenubarItem asChild>
                                <Button
                                  onClick={() => {
                                    form.append({
                                      name: "Enter name here...",
                                      value: `And value here...`,
                                    });
                                  }}
                                  className="flex-y primary-filled sm"
                                  text="Custom"
                                />
                              </MenubarItem>
                            </section>
                          </MenubarContent>
                        </MenubarMenu>
                      </Menubar>
                    </header>
                    <div className="flex flex-col gap-3">
                      {form.fields.map((field, index) => {
                        const name = `${boxName}.${index}.name`;
                        const value = `${boxName}.${index}.value`;
                        const matchesFilter =
                          // @ts-ignore
                          watch(value)
                            // @ts-ignore
                            .toLowerCase()
                            .includes(filter.toLowerCase()) ||
                          // @ts-ignore
                          watch(name)
                            // @ts-ignore
                            .toLowerCase()
                            .includes(filter.toLowerCase());

                        return (
                          matchesFilter && (
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
                          )
                        );
                      })}
                    </div>
                  </>
                )}
              </ArrayFormContext>
              <footer className="border-top flex-between col-span-2 mt-8 w-full gap-3 py-4">
                <div className="clr-ghost flex-y gap-2">
                  <Thunder />
                  <div className="flex flex-col">
                    Vocatio will try to find an icon appropriate for the name of
                    the contact when creating your CVs.
                    <p className="flex-y gap-2">
                      For example, "Address" would match to the following icon:{" "}
                      <Location />
                    </p>
                  </div>
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
