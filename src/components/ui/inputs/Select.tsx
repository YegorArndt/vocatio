import { MouseEventHandler } from "react";
import { Control, Controller, FieldValues } from "react-hook-form";
import ReactSelect, { Options } from "react-select";

type SelectProps<T extends FieldValues = FieldValues> = {
  name: string;
  control: Control<T>;
  options: Options<T>;
  onClick?: MouseEventHandler<HTMLLabelElement>;
};

export const Select = (props: SelectProps) => {
  const { control, name, options, onClick } = props;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => <ReactSelect {...field} options={options} />}
    />
  );
};
