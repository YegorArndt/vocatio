import { type FieldValues, type Control, useController } from "react-hook-form";
import type { MouseEventHandler } from "react";
import cn from "classnames";

export type TextProps<T extends FieldValues = FieldValues> = {
  name: string;
  control: Control<T>;
  onClick?: MouseEventHandler<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >;
  placeholder?: string;
  id?: string;
  className?: string;
};

export const Text = (props: TextProps) => {
  const { name, control, onClick, placeholder, id, className } = props;
  const { field } = useController({ control, name });

  return (
    <div className={cn("input-wrapper", className)}>
      <input
        type="text"
        onClick={onClick}
        className="text-input"
        autoComplete="off"
        autoCapitalize="off"
        autoCorrect="off"
        placeholder={placeholder}
        id={id}
        {...field}
      />
    </div>
  );
};
