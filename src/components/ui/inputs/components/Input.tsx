import { type InputHTMLAttributes } from "react";
import cn from "classnames";

import { useForm } from "react-hook-form";
import { useDraftContext } from "~/modules/draft/DraftContext";

type InputProps = {
  name: string;
  baseCn?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export const Input = (props: InputProps) => {
  const { type = "text", name, value, baseCn, className, ...rest } = props;

  const { downloadFired } = useDraftContext();

  const { register, watch } = useForm({
    defaultValues: {
      [name]: value,
    },
  });

  return (
    <div>
      {downloadFired ? (
        watch(name)
      ) : (
        <input
          type={type}
          className={cn("reset", baseCn, className)}
          {...register(name)}
          {...rest}
        />
      )}
    </div>
  );
};
