import { type FieldValues, type Control, useController } from "react-hook-form";
import type { MouseEventHandler } from "react";

export type TextProps<T extends FieldValues = FieldValues> = {
  name: string;
  control: Control<T>;
  onClick?: MouseEventHandler<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >;
  placeholder?: string;
};

export const Text = (props: TextProps) => {
  const { name, control, onClick, placeholder } = props;
  const { field } = useController({ control, name });

  return (
    <div className="input-wrapper">
      <input
        type="text"
        onClick={onClick}
        className="text-input"
        autoComplete="off"
        autoCapitalize="off"
        autoCorrect="off"
        placeholder={placeholder}
        {...field}
      />
    </div>
  );
};
