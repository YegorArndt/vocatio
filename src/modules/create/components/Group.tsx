import cn from "classnames";

import {
  Autoresize,
  type AutoresizeProps,
} from "~/modules/create/components/Autoresize";

export type GroupProps = {
  label: string;
  value: string;
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
