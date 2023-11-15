import cn from "classnames";

import {
  Autoresize,
  type AutoresizeProps,
} from "~/components/ui/inputs/components/Autoresize";

type GroupProps = {
  label: string;
  value: string;
} & AutoresizeProps;

export const Group = (props: GroupProps) => {
  const { id, label, value, className, ...rest } = props;

  const labelId = `label-${id}`;

  return (
    <div className={cn(className)}>
      <Autoresize id={labelId} value={label} />
      <Autoresize id={id} value={value} />
    </div>
  );
};
