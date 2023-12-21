import { mapValues } from "lodash-es";
import { ReactNode, useState, useCallback, BaseSyntheticEvent } from "react";
import {
  type FieldValues,
  type UseFormProps,
  type UseFormReturn,
  useForm,
  FormProvider,
} from "react-hook-form";

type DefaultValues<T> = NonNullable<T>;

type MandatoryDefaultValues<TFieldValues extends FieldValues> =
  UseFormProps<TFieldValues> & {
    defaultValues: DefaultValues<NonNullable<TFieldValues>>;
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

  const [defaultValues, setDefaultValues] = useState<
    DefaultValues<TFieldValues>
  >(form.defaultValues);

  const methods = useForm<TFieldValues>({
    ...form,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    defaultValues,
  });

  const updateDefaults = useCallback(
    (newDefaults: Partial<DefaultValues<TFieldValues>>) => {
      const normalized = mapValues(newDefaults, (value) => {
        if (value == null) return "";
        if (typeof value === "number") return `${value}`;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
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
