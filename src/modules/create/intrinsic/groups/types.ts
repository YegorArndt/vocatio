import { ImageProps } from "next/image";
import { CSSProperties } from "react";

export type SharedGroupProps = {
  id: string;
  label: string;
  value: string;
  image: string;
  smallText?: string;
  smallTextClassName?: string;
  description?: string;
  className?: string;
  style?: CSSProperties;
  imageProps?: Partial<ImageProps>;
};
