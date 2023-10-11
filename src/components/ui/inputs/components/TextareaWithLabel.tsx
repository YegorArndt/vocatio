import { Label } from "../Label";
import { withLabel } from "../constants";
import { Textarea, type TextareaProps } from "./Textarea";

export const TextareaWithLabel = (props: TextareaProps) => {
  return (
    <div className={withLabel}>
      <Label label={props.label} name={props.name} />
      <Textarea {...props} />
    </div>
  );
};
