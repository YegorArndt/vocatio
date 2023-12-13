import { mapValues } from "lodash-es";
import { ReactNode, useState, useCallback, BaseSyntheticEvent } from "react";
import {
  type FieldValues,
  type UseFormProps,
  type UseFormReturn,
  type DeepPartial,
  useForm,
  FormProvider,
} from "react-hook-form";

type DefaultValues<T> = NonNullable<DeepPartial<T>>;

type MandatoryDefaultValues<TFieldValues extends FieldValues> =
  UseFormProps<TFieldValues> & {
    defaultValues: DefaultValues<TFieldValues>;
  };

interface IFormContextProps<TFieldValues extends FieldValues> {
  children:
    | ReactNode
    | ((
        methods: UseFormReturn<TFieldValues, unknown>,
        submit: (
          onSubmit: (data: TFieldValues) => Promise<void> | void
        ) => Promise<void>,
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
    (newDefaults: Partial<DefaultValues<TFieldValues>>) => {
      const normalized = mapValues(newDefaults, (value) => {
        if (value == null) return "";
        if (typeof value === "number") return `${value}`;
        return value;
      });

      const updatedDefaults = { ...defaultValues, ...normalized };
      setDefaultValues(updatedDefaults);
      methods.reset(updatedDefaults);
    },
    [methods]
  );

  const submit = useCallback(
    (
      onSubmit: (
        data: TFieldValues,
        event?: BaseSyntheticEvent
      ) => Promise<void> | void
    ) => {
      return methods
        .handleSubmit((data, event) => {
          return onSubmit(data, event);
        })()
        .then(() => {
          updateDefaults(methods.getValues() as DefaultValues<TFieldValues>);
        });
    },
    [methods, updateDefaults]
  );

  return (
    <FormProvider {...methods}>
      {typeof children === "function"
        ? children(methods, submit, updateDefaults)
        : children}
    </FormProvider>
  );
};
