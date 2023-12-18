import { useFieldArray, useFormContext } from "react-hook-form";
import { LuCopyPlus } from "react-icons/lu";
import { RiDeleteBin6Line } from "react-icons/ri";
import { BlurImage } from "~/components";
import { AnimatedDiv } from "~/components/AnimatedDiv";
import { Button } from "~/components/ui/buttons/Button";
import { Text } from "~/components/ui/inputs/Text";
import { Textarea } from "~/components/ui/inputs/Textarea";
import { typedKeys } from "~/modules/draft/utils/common";
import { BiMoveVertical } from "react-icons/bi";
import { Divider } from "~/components/layout/Divider";
import { TbRestore } from "react-icons/tb";

const { log } = console;

export const ArrayForm2 = () => {
  const { control, formState, resetField } = useFormContext();
  const { fields, remove, insert, swap } = useFieldArray({
    control,
    name: "entries",
  });

  return fields.map((field, index) => (
    <>
      <AnimatedDiv key={field.id} className="grid grid-cols-[3fr_4fr] gap-4">
        <header className="flex-y gap-4">
          {field.image ? (
            <BlurImage
              src={field.image}
              alt="Missing image"
              width={100}
              height={100}
              className="rounded-md"
            />
          ) : null}
          <div className="flex flex-col gap-2">
            <Text name={`entries.${index}.place`} control={control} />
            <div className="flex-y gap-2">
              <Button onClick={() => remove(index)}>
                <RiDeleteBin6Line />
              </Button>
              <Button onClick={() => insert(index + 1, field)}>
                <LuCopyPlus />
              </Button>
              <Button onClick={() => resetField(`entries.${index}`)}>
                <TbRestore />
              </Button>
            </div>
          </div>
        </header>
        <form className="flex flex-col gap-2">
          {typedKeys(field).map((name) => {
            const shouldRender = !["name", "image", "id"].includes(name);

            if (!shouldRender) return null;

            const isDescription = name === "description";

            const props = {
              key: name,
              name: `entries.${index}.${name}`,
              control,
              placeholder: isDescription
                ? `Missing description`
                : `Missing ${name}`,
            };
            const Component = isDescription ? Textarea : Text;

            return <Component {...props} />;
          })}
        </form>
      </AnimatedDiv>
      {index < fields.length - 1 && (
        <div className="flex-center">
          <Divider />
          <Button
            text="Swap"
            endIcon={<BiMoveVertical />}
            onClick={() => swap(index, index + 1)}
            className="flex-y px-5"
          />
          <Divider />
        </div>
      )}
    </>
  ));
};
