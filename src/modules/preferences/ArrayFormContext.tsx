import {
  useFormContext,
  useFieldArray,
  FieldValues,
  UseFieldArrayReturn,
} from "react-hook-form";

const { log } = console;

type ArrayFormProps = {
  children: (a: {
    form: UseFieldArrayReturn<FieldValues, "entries", string>;
  }) => JSX.Element;
};

export const ArrayFormContext = (props: ArrayFormProps) => {
  const { children } = props;
  const { control } = useFormContext();
  const form = useFieldArray({
    control,
    name: "entries",
  });

  return <>{children({ form })}</>;
};
