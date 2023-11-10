import classNames from "classnames";
import {
  Input,
  type InputProps,
} from "~/components/ui/inputs/components/Input";
import { useDraftContext } from "~/modules/draft/DraftContext";

type HeadingProps = InputProps;

export const Heading = (props: HeadingProps) => {
  const { className, name, value } = props;

  const {
    draftState: { DOWNLOAD_FIRED },
  } = useDraftContext();

  return (
    <div
      className={classNames(className, {
        // TODO: Unclear why this problem occurs.
        "pb-[1rem]": DOWNLOAD_FIRED,
      })}
    >
      <Input name={name} value={value} />
    </div>
  );
};
