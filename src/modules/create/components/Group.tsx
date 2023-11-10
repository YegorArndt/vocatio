import cn from "classnames";

import {
  Autoresize,
  type AutoresizeProps,
} from "~/components/ui/inputs/components/Autoresize";

type GroupProps = {
  name: string;
  label: string;
  value: string;
} & AutoresizeProps;

export const Group = (props: GroupProps) => {
  const { name, label, value, className, ...rest } = props;

  const labelName = `label-${name}`;
  const valueName = `value-${name}`;

  return (
    <div className={cn(className)}>
      <Autoresize name={labelName} value={label} />
      <Autoresize name={valueName} value={value} />
    </div>
  );
};
