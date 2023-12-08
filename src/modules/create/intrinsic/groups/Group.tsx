import { Autoresize } from "~/modules/create/intrinsic/Autoresize";
import type { SharedGroupProps } from "./types";

export const Group = (props: SharedGroupProps) => {
  const { id, label, text, smallText, smallTextClassName, className, ...rest } =
    props;

  return (
    <div className={className} {...rest}>
      <Autoresize value={label} />
      <div className="flex flex-col">
        <Autoresize value={text} />
        {smallText && (
          <small className={smallTextClassName}>
            <Autoresize value={smallText} />
          </small>
        )}
      </div>
    </div>
  );
};
