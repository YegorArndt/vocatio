import { ComponentValue } from "~/modules/draft/types/components";
import { Autoresize } from "./Autoresize";

export type NameProps = {
  className?: string;
  id?: string;
  value?: ComponentValue;
  classNameFirst?: string;
  classNameLast?: string;
};

export const Name = (props: NameProps) => {
  const { className, value, id, classNameFirst, classNameLast } = props;

  const [firstName, lastName] = (value as string)!.split(" ");

  const firstNameId = `${id}-first-name`;

  return (
    <div className={className}>
      <Autoresize
        id={firstNameId}
        value={firstName}
        className={classNameFirst}
      />
      <Autoresize
        id={`${id}-last-name`}
        value={lastName}
        className={classNameLast}
      />
    </div>
  );
};
