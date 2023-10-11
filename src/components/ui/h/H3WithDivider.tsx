import { Textarea } from "../inputs/components/Textarea";

type H3WithDividerProps = {
  name: string;
};

export const H3WithDivider = (props: H3WithDividerProps) => {
  return (
    <h3
      style={{ borderBottom: "2px solid currentColor" }}
      className="mb-2 mt-2
      pb-2"
    >
      <Textarea {...props} />
    </h3>
  );
};
