import { DraftComponent } from "~/modules/draft/types";
import { Textarea } from "./components/Textarea";

export const Label = (props: DraftComponent) => {
  const { label, name } = props;

  return (
    <label htmlFor={name}>
      <Textarea {...props} name={`label-for-${name}`} defaultValue={label} />
    </label>
  );
};
