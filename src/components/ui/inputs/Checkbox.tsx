import cn from "classnames";
import { MouseEventHandler } from "react";
import { Control, FieldValues, useController } from "react-hook-form";
import { IoMdCheckmark } from "react-icons/io";

type CheckboxProps<T extends FieldValues = FieldValues> = {
  name: string;
  height?: string;
  width?: string;
  label?: string;
  control: Control<T>;
  onClick?: MouseEventHandler<HTMLLabelElement>;
};

export const Checkbox = (props: CheckboxProps) => {
  const { control, name, height = "h-5", width = "w-5", onClick } = props;
  const { field } = useController({ control, name });

  return (
    <label
      className={cn("relative cursor-pointer border", height, width)}
      onClick={onClick}
    >
      <input
        type="checkbox"
        className="size-full absolute inset-0 cursor-pointer opacity-0"
        {...field}
      />
      {field.value && (
        <IoMdCheckmark
          className={cn("rounded-sm bg-white text-black", height, width)}
        />
      )}
    </label>
  );
};
