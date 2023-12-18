import cn from "classnames";
import { MouseEventHandler, ReactNode } from "react";
import { Control, FieldValues, useController } from "react-hook-form";

type CheckboxProps<T extends FieldValues = FieldValues> = {
  name: string;
  height?: string;
  width?: string;
  label?: ReactNode;
  control: Control<T>;
  onClick?: MouseEventHandler<HTMLLabelElement>;
  className?: string;
  inputClassName?: string;
};

export const Checkbox = (props: CheckboxProps) => {
  const { control, name, label, onClick, className, inputClassName } = props;
  const { field } = useController({ control, name });

  return (
    <div className={cn("flex items-center", className)}>
      <input
        id={name}
        type="checkbox"
        className={cn(
          "text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600 h-4 w-4 rounded focus:ring-2",
          inputClassName
        )}
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
