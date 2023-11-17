import cn from "classnames";

import {
  Autoresize,
  type AutoresizeProps,
} from "~/components/ui/inputs/components/Autoresize";

export const Heading = (props: AutoresizeProps) => {
  const { className, ...rest } = props;

  return <Autoresize className={cn(className)} {...rest} />;
};
