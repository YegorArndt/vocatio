import {
  useFormContext,
  useFieldArray,
  FieldValues,
  UseFieldArrayReturn,
} from "react-hook-form";

const { log } = console;

type ArrayFormProps = {
  children: (a: {
    form: UseFieldArrayReturn<FieldValues, string, string>;
  }) => JSX.Element;
  name?: string;
};

export const ArrayFormContext = (props: ArrayFormProps) => {
  const { children, name = "entries" } = props;
  const { control } = useFormContext();
  const form = useFieldArray({
    control,
    name,
  });

  return <>{children({ form })}</>;
};
