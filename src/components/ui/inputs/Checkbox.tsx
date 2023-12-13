import { MouseEventHandler } from "react";
import { Control, FieldValues, useController } from "react-hook-form";

type CheckboxProps<T extends FieldValues = FieldValues> = {
  name: string;
  height?: string;
  width?: string;
  label?: string;
  control: Control<T>;
  onClick?: MouseEventHandler<HTMLLabelElement>;
};

export const Checkbox = (props: CheckboxProps) => {
  const { control, name, label, onClick } = props;
  const { field } = useController({ control, name });

  return (
    <div className="flex items-center">
      <input
        id={name}
        type="checkbox"
        className="text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600 h-4 w-4 rounded focus:ring-2"
        {...field}
      />
      {label && (
        <label
          htmlFor={name}
          className="text-gray-900 dark:text-gray-300 ms-2 text-sm font-medium"
        >
          {label}
        </label>
      )}
    </div>
  );
};
