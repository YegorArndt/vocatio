import { type CSSProperties } from "react";

export type DividerProps = {
  className: string;
  style?: CSSProperties;
};

export const Divider = (props: DividerProps) => {
  const { className } = props;

  return <div className={className} />;
};
