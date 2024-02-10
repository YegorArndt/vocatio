import { startCase } from "lodash-es";
import { typedKeys } from "../../../../../__archieved/draft/utils/common";
import { Text } from "~/components/ui/inputs/Text";
import { Fragment } from "react";
import { FormContext } from "../../FormContext";
import { Textarea } from "~/components/ui/inputs/Textarea";
import { Button } from "~/components/ui/buttons/Button";
import { Spinner } from "~/components";
import { AnimatedDiv } from "~/components/AnimatedDiv";

const { log } = console;

//@ts-ignore
export const MainBox = (props) => {
  const { data, update, isUpdating } = props;
  const defaultValues = data;

  return (
    <FormContext
      form={{
        defaultValues,
      }}
    >
      {({ control, formState }, submit) => (
        <>
          <AnimatedDiv className="grid grid-cols-2 gap-3">
            {typedKeys(defaultValues).map(
              (key) =>
                key !== "professionalSummary" && (
                  //@ts-ignore
                  <Fragment key={key}>
                    {/* @ts-ignore */}
                    <label htmlFor={key}>{startCase(key)}</label>
                    {/* @ts-ignore */}
                    <Text id={key} name={key} control={control} />
                  </Fragment>
                )
            )}
            <label htmlFor="professionalSummary">Professional summary</label>
            <Textarea
              name="professionalSummary"
              placeholder="Please copy-paste manually from LinkedIn."
              control={control}
              className="col-span-2"
              rows={10}
            />
          </AnimatedDiv>
          <footer className="border-top flex-between col-span-2 mt-8 w-full gap-3 py-4">
            <Button
              frontIcon={isUpdating && <Spinner size={10} />}
              text={isUpdating ? "Updating..." : "Update"}
              onClick={() => void submit(update)}
              className="primary sm flex-y ml-auto"
              disabled={isUpdating || !formState.isDirty}
            />
          </footer>
        </>
      )}
    </FormContext>
  );
};
