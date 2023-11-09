import {
  Input,
  type InputProps,
} from "~/components/ui/inputs/components/Input";

type HeadingProps = InputProps;

export const Heading = (props: HeadingProps) => {
  const { className, name, value } = props;

  return (
    <div className={className}>
      <Input name={name} value={value} />
    </div>
  );
};
