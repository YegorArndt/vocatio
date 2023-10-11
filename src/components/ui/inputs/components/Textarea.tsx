import { useDraftContext } from "~/modules/draft/DraftProvider";
import { Autoresize } from "./Autoresize";
import type { DraftComponent } from "~/modules/draft/types";

export type TextareaProps = DraftComponent;

export const Textarea = (props: TextareaProps) => {
  const {
    name,
    defaultValue,
    /**
     * Destroy these props.
     */
    label,
    component,
    areaId,
    index,
    ...other
  } = props;

  const { register, getDefaultValue } = useDraftContext();

  return (
    <Autoresize
      {...other}
      {...register(name)}
      name={name}
      defaultValue={getDefaultValue(name, defaultValue)}
      placeholder={getDefaultValue(name, defaultValue)}
    />
  );
};
