import cn from "classnames";
import { type MouseEventHandler } from "react";
import { Control, useController, type FieldValues } from "react-hook-form";
import { type Options } from "react-select";
import CreatableSelect from "react-select/creatable"; // Import CreatableSelect

const { log } = console;

export type SelectProps<T extends FieldValues = FieldValues> = {
  name: string;
  control: Control<T>;
  options: Options<T>;
  onClick?: MouseEventHandler<HTMLLabelElement>;
  className?: string;
  getOptionLabel?: (option: T) => string;
  getOptionValue?: (option: T) => string;
};

export const Select = (props: SelectProps) => {
  const { control, name, options, onClick, className, ...rest } = props;
  const { field } = useController({ control, name });

  return (
    <CreatableSelect
      id={name}
      options={options}
      className={cn("my-react-select-container", className)}
      classNamePrefix="my-react-select"
      isClearable
      {...rest}
      {...field}
    />
  );
};
