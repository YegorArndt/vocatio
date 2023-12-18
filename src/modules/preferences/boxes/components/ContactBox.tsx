import cn from "classnames";
import { get, isNil, startCase } from "lodash-es";
import { api } from "~/utils";
import { typedEntries, typedKeys } from "../../../draft/utils/common";
import { Text } from "~/components/ui/inputs/Text";
import { useEffect, useState } from "react";
import { Contact } from "@prisma/client";
import { Wrapper } from "./Wrapper";
import { FormContext } from "../../FormContext";
import { LineStack } from "~/components/Spinner";
import { SaveButton } from "~/components/SaveButton";
import {
  FocusableItem,
  Menu,
  MenuButton,
  MenuHeader,
  MenuItem,
} from "@szhsin/react-menu";
import { LuPlusCircle } from "react-icons/lu";
import { icons } from "~/constants";
import { AnimatedDiv } from "~/components/AnimatedDiv";

const { log } = console;

type ContactValueType = string | Date | null;

const separateEntries = (obj: Record<string, unknown>) => {
  const definedEntries = {};
  const undefinedEntries = {};

  Object.entries(obj).forEach(([key, value]) => {
    if (isNil(value)) {
      undefinedEntries[key] = value;
    } else {
      definedEntries[key] = value;
    }
  });

  return { definedEntries, undefinedEntries };
};

const filterForClient = (contact?: Contact | null) => {
  if (!contact) return {};

  const irrelevantKeys = new Set([
    "id",
    "createdAt",
    "updatedAt",
    "user",
    "userId",
  ]);

  return typedEntries(contact)
    .filter(([key]) => !irrelevantKeys.has(key))
    .reduce(
      (obj: Partial<Record<keyof Contact, ContactValueType>>, [key, value]) => {
        obj[key] = value as ContactValueType;
        return obj;
      },
      {}
    );
};

export const ContactBox = () => {
  const { data: user, isLoading: userLoading } = api.users.get.useQuery();
  const {
    mutate,
    isLoading: userUpdating,
    isSuccess,
    reset,
  } = api.users.update.useMutation();

  const [filter, setFilter] = useState("");
  const [defaultValues, setDefaultValues] = useState<Partial<Contact> | null>(
    null
  );
  const [options, setOptions] = useState<Partial<Contact> | null>(null);

  useEffect(() => {
    if (user?.contact && !defaultValues) {
      const { definedEntries, undefinedEntries } = separateEntries(
        filterForClient(user.contact)
      );
      setDefaultValues(definedEntries);
      setOptions(undefinedEntries);
    }
  }, [user, userLoading]);

  const onSubmit = (values: typeof defaultValues) => {
    mutate({ contact: values });
  };

  return (
    <Wrapper entryFor="contact">
      {userLoading && <LineStack />}
      {defaultValues && (
        <FormContext
          form={{
            defaultValues,
          }}
        >
          {({ control, formState }, submit, updateDefaults) => (
            <>
              <form className="flex flex-col gap-3">
                {typedKeys(defaultValues).map((key) => (
                  <AnimatedDiv key={key} className="grid grid-cols-2 gap-3">
                    <label htmlFor={key}>{startCase(key)}</label>
                    <Text
                      id={key}
                      name={key}
                      control={control}
                      placeholder="Leave blank if not needed"
                    />
                  </AnimatedDiv>
                ))}
              </form>
              {options && Object.keys(options).length > 0 && (
                <Menu
                  menuButton={
                    <MenuButton className="secondary lg flex-y ml-4 w-1/3 gap-3 rounded-md">
                      <LuPlusCircle />
                      Add more
                    </MenuButton>
                  }
                  transition
                  gap={10}
                  direction="left"
                >
                  <MenuHeader>Type to filter</MenuHeader>
                  <FocusableItem>
                    {({ ref }) => (
                      <input
                        ref={ref}
                        type="text"
                        placeholder="Type to filter"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className={cn(
                          "border-gray-300 focus:border-gray-500 w-full border-b bg-transparent p-2 focus:outline-none"
                        )}
                      />
                    )}
                  </FocusableItem>
                  {typedKeys(options)
                    .filter((key) =>
                      key.toUpperCase().includes(filter.trim().toUpperCase())
                    )
                    .map((key) => {
                      const Icon = get(icons, key) ?? icons.diamond;

                      return (
                        <MenuItem
                          key={key}
                          onClick={() => {
                            if (!options) return;

                            const newDefaultValues = {
                              ...defaultValues,
                              [key]: options[key],
                            };

                            setOptions((prev) => {
                              const { [key]: _, ...rest } = prev;
                              return rest;
                            });
                            setDefaultValues(newDefaultValues);
                            updateDefaults(newDefaultValues);
                          }}
                        >
                          <Icon /> &nbsp;&nbsp;{startCase(key)}
                        </MenuItem>
                      );
                    })}
                </Menu>
              )}
              <footer className="border-top flex-between py-4">
                <SaveButton
                  isLoading={userUpdating}
                  isSuccess={isSuccess}
                  reset={reset}
                  disabled={!formState.isDirty || userUpdating}
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
