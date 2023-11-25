import cn from "classnames";

import {
  Autoresize,
  type AutoresizeProps,
} from "~/modules/create/cv-components/Autoresize";
import { ComponentValue } from "~/modules/draft/types/components";

export type GroupProps = {
  label?: string;
  img?: string;
  value?: ComponentValue;
} & AutoresizeProps;

export const Group = (props: GroupProps) => {
  const { id, label, value, className, ...rest } = props;

  const labelId = `label-${id}`;

  return (
    <div className={cn(className)} {...rest}>
      <Autoresize id={labelId} value={label} />
      <Autoresize id={id} value={value} />
    </div>
  );
};
