import { ReactNode, useState, useCallback } from "react";
import {
  FieldValues,
  UseFormProps,
  UseFormReturn,
  DeepPartial,
  useForm,
  FormProvider,
} from "react-hook-form";

type MandatoryDefaultValues<TFieldValues extends FieldValues> =
  UseFormProps<TFieldValues> & {
    defaultValues: NonNullable<UseFormProps<TFieldValues>["defaultValues"]>;
  };

interface IFormContextProps<TFieldValues extends FieldValues> {
  children:
    | ReactNode
    | ((
        methods: UseFormReturn<TFieldValues, unknown>,
        updateDefaults: (newDefaults: Partial<TFieldValues>) => void
      ) => ReactNode);
  form: MandatoryDefaultValues<TFieldValues>;
}

export const FormContext = <TFieldValues extends FieldValues>(
  props: IFormContextProps<TFieldValues>
) => {
  const { children, form } = props;

  const [defaultValues, setDefaultValues] = useState<DeepPartial<TFieldValues>>(
    form.defaultValues
  );

  const methods = useForm<TFieldValues>({ ...form, defaultValues });

  const updateDefaults = useCallback(
    (newDefaults: Partial<TFieldValues>) => {
      const updatedDefaults = { ...defaultValues, ...newDefaults };
      setDefaultValues(updatedDefaults);
      methods.reset(updatedDefaults);
    },
    [methods]
  );

  return (
    <FormProvider {...methods}>
      {typeof children === "function"
        ? children(methods, updateDefaults)
        : children}
    </FormProvider>
  );
};
