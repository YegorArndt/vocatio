import CopyToClipboard from "~/components/CopyToClipboard";
import { SaveButton } from "~/components/SaveButton";
import { Textarea } from "~/components/ui/inputs/Textarea";
import { FormContext } from "../../FormContext";
import { Wrapper } from "./Wrapper";
import { api } from "~/utils";
import { Chip } from "~/components";
import { EntryHydrationSkeleton } from "~/components/Spinner";

const args = ["companyName", "location", "companyLogo", "jobTitle"];

export const ProfessionalSummary = () => {
  const { data: user, isLoading: userLoading } = api.users.get.useQuery();
  const {
    mutate,
    isSuccess,
    isLoading: userUpdating,
  } = api.users.update.useMutation();
  const defaultValues = user
    ? { professionalSummary: user.professionalSummary }
    : null;

  return (
    <Wrapper entryFor="professionalSummary" omitLink>
      <header className="flex flex-col gap-3">
        <p>
          You can dynamically insert these arguments into your professional
          summary. Click to copy.
        </p>
        <div className="flex-y gap-5 font-semibold">
          {args.map((arg) => (
            <CopyToClipboard text={`{${arg}}`}>
              <Chip
                text={`{${arg}}`}
                className="bg-border px-3 py-1 transition-all hover:scale-105"
              />
            </CopyToClipboard>
          ))}
        </div>
      </header>
      {userLoading && <EntryHydrationSkeleton />}
      {defaultValues && (
        <FormContext
          form={{
            defaultValues,
          }}
        >
          {({ control, formState }) => (
            <section className="flex flex-col gap-5">
              <div className="flex flex-col gap-3">
                <label htmlFor="professionalSummary">
                  Professional summary
                </label>
                <Textarea
                  name="professionalSummary"
                  control={control}
                  className="col-span-2"
                  rows={10}
                />
              </div>
              <footer>
                <SaveButton
                  isLoading={userUpdating}
                  isSuccess={isSuccess}
                  disabled={userUpdating || !formState.isDirty}
                />
              </footer>
            </section>
          )}
        </FormContext>
      )}
      <footer className="border-top flex-between py-4">
        <span className="clr-disabled">
          The Summary you're seeing here will be used during CV generation.
        </span>
      </footer>
    </Wrapper>
  );
};
