import ReactPhoneInput from "react-phone-input-2";
import {
  DefaultInputComponentProps,
  type Props,
} from "react-phone-number-input-2";
import cn from "classnames";
import type { Component } from "@prisma/client";

import { withLabel } from "../constants";
import { useDraftContext } from "~/modules/draft/DraftProvider";
import { reset } from "../../constants";
import { Label } from "../Label";

type PhoneInputProps = {} & DefaultInputComponentProps & Partial<Component>;

export const PhoneInput = (props: Props<PhoneInputProps>) => {
  const { name, label, defaultValue, className, baseCn, ...other } = props;
  const { register } = useDraftContext();

  return (
    <div className={cn(withLabel)}>
      <Label name={name} label={label} />
      <ReactPhoneInput
        specialLabel=""
        inputClass={cn(reset, className, baseCn)}
        autoComplete={name}
        {...register(name)}
        {...other}
      />
    </div>
  );
};
