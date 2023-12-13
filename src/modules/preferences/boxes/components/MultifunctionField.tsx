import { LuCopyPlus } from "react-icons/lu";
import { Button } from "~/components/ui/buttons/Button";
import { Text, TextProps } from "~/components/ui/inputs/Text";

type MultifunctionFieldProps = TextProps & {};

export const MultifunctionField = (props: MultifunctionFieldProps) => {
  const { name, control } = props;

  return (
    <>
      <label htmlFor={name}></label>
      <div className="grid grid-cols-[1fr_30px_30px] gap-2">
        <Text name={name} control={control} />
        <Button title={`Duplicate ${name}`} className="flex-center">
          <LuCopyPlus />
        </Button>
        <Button className="flex-center">
          <LuCopyPlus />
        </Button>
      </div>
    </>
  );
};
