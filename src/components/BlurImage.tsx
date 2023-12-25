import { useState } from "react";
import Image, { type ImageProps } from "next/image";
import cn from "classnames";

export type BlurImageProps = {
  imageClassName?: string;
} & ImageProps;

export const BlurImage = (props: BlurImageProps) => {
  const { className, height, width, alt = "", ...rest } = props;
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className={cn("bg-gray-200 overflow-hidden", className)}>
      <Image
        height={height}
        width={width}
        className={cn(
          "duration-700 ease-in-out group-hover:opacity-75 [&>img]:inline-block",
          isLoading
            ? "scale-110 blur-2xl grayscale"
            : "scale-100 blur-0 grayscale-0"
        )}
        alt={alt}
        {...rest}
        onLoadingComplete={() => setIsLoading(false)}
        draggable={false}
      />
    </div>
  );
};
