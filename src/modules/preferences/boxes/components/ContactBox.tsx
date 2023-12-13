import { isNil, startCase } from "lodash-es";
import { api } from "~/utils";
import { typedEntries, typedKeys } from "../../../draft/utils/common";
import { Text } from "~/components/ui/inputs/Text";
import { Fragment, useEffect, useState } from "react";
import { Button } from "~/components/ui/buttons/Button";
import { Contact } from "@prisma/client";
import { Wrapper } from "./Wrapper";
import { FormContext } from "../../FormContext";
import { LineStack } from "~/components/Spinner";
import { Linkedin } from "~/components/icons";
import { Blur } from "~/components/Blur";
import { Link } from "~/components/ui/buttons/Link";
import { SaveButton } from "~/components/SaveButton";
import { ComingSoon } from "~/components/ComingSoon";
import { LuCopyPlus } from "react-icons/lu";
import { Menu, MenuButton, MenuItem } from "@szhsin/react-menu";

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
  const {
    data: user,
    isLoading: userLoading,
    isFetched,
  } = api.users.get.useQuery();
  const {
    data,
    mutate,
    isLoading: userUpdating,
    isSuccess,
    reset,
  } = api.users.update.useMutation();

  const { data: url } = api.urls.get.useQuery();
  const { mutate: createUrl } = api.urls.create.useMutation();

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
      {!userLoading && (
        <>
          <section className="flex-between">
            <h6 className="flex-y gap-2 font-semibold">
              <Blur element={<Linkedin fontSize={30} />} /> Short Linkedin Url
              <ComingSoon />
            </h6>
            <Link
              text={`✨ vocatio.io/${url?.shortUrl}.com`}
              to={`https://localhost:3000/${url?.shortUrl}.com`}
              className="hover:underline"
              newTab
            />
          </section>
          <footer className="border-top border-bottom flex-between py-4">
            <div className="clr-disabled">
              This URL is shown in your CVs instead of the large
              <br />
              <code>
                https://www.linkedin.com/in/
                {user?.contact?.linkedin}.
              </code>
              <br />
              Whenever someone (likely a recruiter) clicks on this link, you
              will be notified.{" "}
            </div>
            <div className="flex flex-col gap-3">
              <Button
                text="Regenerate"
                onClick={void createUrl}
                className="primary sm"
              />
              <Button
                text="Disable"
                onClick={void createUrl}
                className="sm common rounded-md bg-red"
              />
            </div>
          </footer>
        </>
      )}
      {defaultValues && (
        <FormContext
          form={{
            defaultValues,
          }}
        >
          {(
            { control, formState, handleSubmit, getValues },
            submit,
            updateDefaults
          ) => (
            <>
              <form className="grid grid-cols-2 gap-3">
                {typedKeys(defaultValues).map((key) => (
                  <Fragment key={key}>
                    <label htmlFor={key}>{startCase(key)}</label>
                    <Text id={key} name={key} control={control} />
                  </Fragment>
                ))}
              </form>
              {options && Object.keys(options).length > 0 && (
                <Menu
                  menuButton={
                    <MenuButton className="secondary lg flex-y ml-4 w-1/3 gap-3">
                      <LuCopyPlus /> Add more
                    </MenuButton>
                  }
                  transition
                  gap={5}
                  direction="left"
                >
                  {typedKeys(options).map((key) => (
                    <MenuItem
                      key={key}
                      onClick={() => {
                        if (!options) return;

                        const newDefaultValues = {
                          ...defaultValues,
                          [key]: "",
                        };

                        setOptions((prev) => {
                          const { [key]: _, ...rest } = prev;
                          return rest;
                        });
                        setDefaultValues(newDefaultValues);
                        updateDefaults(newDefaultValues);
                      }}
                    >
                      {startCase(key)}
                    </MenuItem>
                  ))}
                </Menu>
              )}
              <footer className="border-top flex-between py-4">
                <span className="clr-disabled">
                  Expand to add more contact information.
                </span>
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
