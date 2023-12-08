import { startCase } from "lodash-es";
import { useForm } from "react-hook-form";
import { api } from "~/utils";
import { typedEntries } from "../../../draft/utils/common";
import { Text } from "~/components/ui/inputs/Text";
import { Fragment } from "react";
import { Button } from "~/components/ui/buttons/Button";
import { Contact, User } from "@prisma/client";
import { Wrapper } from "./Wrapper";
import { FormContext } from "../../FormContext";
import { LineStack } from "~/components/Spinner";
import { Linkedin } from "~/components/icons";
import { Blur } from "~/components/Blur";
import { Link } from "~/components/ui/buttons/Link";
import { Chip } from "~/components";

type ContactValueType = string | Date | null;

const toDefinedEntries = (obj: Record<string, unknown>) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value != null)
  );
};

const getUndefinedEntries = (obj: Record<string, unknown>) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => (value = null))
  );
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
  const { data: user, isLoading } = api.users.get.useQuery();
  const { data: url } = api.urls.get.useQuery();
  const { mutate: createUrl } = api.urls.create.useMutation();

  const contact = filterForClient(user?.contact);

  const definedEntries: Partial<User> = toDefinedEntries(contact);
  const undefinedKeys = getUndefinedEntries(contact);

  const { control, formState } = useForm({ defaultValues: definedEntries });

  return (
    <Wrapper>
      <header className="flex-between">
        <h4 id="contact">Contact</h4>
      </header>
      {isLoading && <LineStack />}
      {!isLoading && (
        <>
          <section className="flex-between">
            <h6 className="flex-y gap-2 font-semibold">
              <Blur element={<Linkedin fontSize={30} />} /> Short Linkedin Url
              <Chip text="Beta" className="bg-sky clr-white" />
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
              https://www.linkedin.com/in/
              {user?.contact?.linkedin}.
              <br />
              Whenever someone (likely a recruiter) clicks on this link, you
              will be notified.{" "}
            </div>
            <Button
              text="Regenerate"
              onClick={void createUrl}
              className="primary sm ml-auto w-1/5"
            />
          </footer>
        </>
      )}
      {!isLoading && (
        <FormContext
          form={{
            defaultValues: definedEntries,
          }}
        >
          {({ control }) => (
            <>
              <form className="grid grid-cols-2 gap-3">
                {Object.keys(definedEntries).map((key) => (
                  <Fragment key={key}>
                    <label htmlFor={key}>{startCase(key)}</label>
                    <Text id={key} name={key} control={control} />
                  </Fragment>
                ))}
              </form>
              <footer className="border-top flex-between py-4">
                <span className="clr-disabled">
                  Expand to add more contact information.
                </span>
                <Button
                  text="Save"
                  disabled={!formState.isDirty}
                  className="primary sm ml-auto w-1/5"
                />
              </footer>
            </>
          )}
        </FormContext>
      )}
    </Wrapper>
  );
};
