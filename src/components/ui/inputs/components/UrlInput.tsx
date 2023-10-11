import { ChangeEvent, useState } from "react";
import { BaseInputProps } from "./BaseInput"; // Update the import path accordingly
import { reset } from "../../constants";
import { useDraftContext } from "~/modules/draft/DraftProvider";
import cn from "classnames";
import type { ActionType } from "~/modules/draft/types";
import { FIELD_ONCHANGE_FIRED } from "~/modules/draft/actions";
import { BaseButton } from "../../buttons/BaseButton";
import { validateUrl, getShortUrl } from "~/utils/url-utils";
import { Label } from "../Label";
import { withLabel } from "../constants";

type UrlInputProps = BaseInputProps & {
  label: string;
  url: string;
  action: ActionType;
};

export const UrlInput = (props: UrlInputProps) => {
  const {
    label,
    url,
    name,
    defaultValue,
    action = FIELD_ONCHANGE_FIRED,
    baseCn,
    className,
    ...other
  } = props;
  const [isValid, setIsValid] = useState(true);
  const [isErrorDismissed, setIsErrorDismissed] = useState(false);
  const { register, getDefaultValue, setValue } = useDraftContext();

  const onChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;

    if (validateUrl(url)) {
      setIsValid(true);

      const data = await getShortUrl(url);

      if (data) {
        const { shortUrl } = data;
        setValue(name, shortUrl);
        register(name).onChange(e);
      }
    } else {
      setIsValid(false);
    }
  };

  return (
    <>
      <div className={cn("flex", withLabel)}>
        <Label label={label} name={name} />
        <input
          {...register(name)}
          {...other}
          onChange={onChange}
          className={cn(reset, baseCn, className)}
          suppressHydrationWarning
          data-action={action}
          placeholder="url"
        />
      </div>
      {!isValid && !isErrorDismissed && (
        <small className="flex-between mt-1 w-full whitespace-nowrap rounded-md bg-red pl-1 clr-white">
          We can't shorten an invalid URL.
          <BaseButton
            className="h-4 w-4 rounded-full bg-white text-center clr-red"
            onClick={() => setIsErrorDismissed(true)}
          >
            X
          </BaseButton>
        </small>
      )}
    </>
  );
};
