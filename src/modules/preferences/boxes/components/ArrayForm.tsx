import { useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { LuCopyPlus } from "react-icons/lu";
import { RiDeleteBin6Line } from "react-icons/ri";
import { AnimatedDiv } from "~/components/AnimatedDiv";
import { Button } from "~/components/ui/buttons/Button";
import { Select, SelectProps } from "~/components/ui/inputs/Select";

const { log } = console;

type ArrayFormProps = {
  labelOptions: SelectProps["options"][];
  valueOptions: SelectProps["options"][];
};

export const ArrayForm = (props: ArrayFormProps) => {
  const { labelOptions, valueOptions } = props;
  const { control, getValues } = useFormContext();
  const { fields, remove, insert } = useFieldArray({
    control,
    name: "entries",
  });
  const [expanded, setExpanded] = useState(false);

  return (
    <form className="flex flex-col gap-3">
      {fields.map((field, index) => {
        const canShowMore = expanded || index < 4;

        return (
          canShowMore && (
            <AnimatedDiv key={field.id} className="grid grid-cols-2 gap-3">
              <Select
                control={control}
                name={`entries.${index}.name`}
                options={labelOptions}
                noOptionsMessage={() =>
                  "Type your custom skill or visit advanced fine-tuning to get suggestions"
                }
              />
              <div className="flex-y gap-2">
                <Select
                  control={control}
                  name={`entries.${index}.level`}
                  options={valueOptions}
                  className="w-full"
                />
                <div className="flex-y gap-2">
                  <Button onClick={() => remove(index)}>
                    <RiDeleteBin6Line />
                  </Button>
                  <Button
                    onClick={() => {
                      insert(index + 1, {
                        name: field.name,
                        level: field.level,
                      });
                      if (!expanded) setExpanded(true);
                    }}
                  >
                    <LuCopyPlus />
                  </Button>
                </div>
              </div>
            </AnimatedDiv>
          )
        );
      })}
      {fields.length > 4 && (
        <Button
          text={expanded ? "Show less" : `Show all ${fields.length} items`}
          className="sm outlined mt-3"
          onClick={() => setExpanded(!expanded)}
        />
      )}
    </form>
  );
};
