import cn from "classnames";

import {
  Autoresize,
  AutoresizeProps,
} from "~/components/ui/inputs/components/Autoresize";
import { useDraftContext } from "~/modules/draft/DraftContext";

type HeadingProps = AutoresizeProps & {};

export const Heading = (props: AutoresizeProps) => {
  const { className, ...rest } = props;
  const {
    draftState: { DOWNLOAD_FIRED },
  } = useDraftContext();

  return (
    <Autoresize
      className={cn(className, {
        "pb-2": DOWNLOAD_FIRED,
      })}
      {...rest}
    />
  );
};
