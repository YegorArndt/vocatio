import cn from "classnames";
import { MouseEventHandler } from "react";
import { Control, FieldValues, useController } from "react-hook-form";

export type TextareaProps<T extends FieldValues = FieldValues> = {
  name: string;
  control: unknown;
  onClick?: MouseEventHandler<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = (props: TextareaProps) => {
  const {
    name,
    control,
    placeholder,
    defaultValue,
    className,
    onClick,
    id = name,
    ...rest
  } = props as {
    control: Control<FieldValues>;
  } & TextareaProps<FieldValues>;
  const { field } = useController({ control, name });

  return (
    <div className={cn("input-wrapper !h-auto", className)}>
      <textarea
        rows={4}
        onClick={onClick}
        className="text-input"
        autoComplete="off"
        autoCapitalize="off"
        autoCorrect="off"
        placeholder={placeholder}
        id={id}
        {...rest}
        {...field}
      />
    </div>
  );
};
