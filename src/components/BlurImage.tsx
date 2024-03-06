import { ReactNode, useState } from "react";
import Image, { type ImageProps } from "next/image";
import cn from "classnames";

export type BlurImageProps = {
  imageClassName?: string;
  fallback?: ReactNode;
  rounded?: boolean;
} & Omit<ImageProps, "alt" | "src"> & {
    alt?: string;
    src: string | undefined | null;
  };

export const BlurImage = (props: BlurImageProps) => {
  const {
    className,
    height = 25,
    width = 25,
    alt = "",
    src,
    fallback,
    rounded,
    fill,
    ...rest
  } = props;
  const [isLoading, setIsLoading] = useState(true);

  if (!src) return fallback || null;

  return fill ? (
    <div className={className}>
      <Image
        src={src!}
        fill
        className={cn(
          "duration-700 ease-in-out group-hover:opacity-75 [&>img]:inline-block",
          isLoading
            ? "scale-110 blur-2xl grayscale"
            : "scale-100 blur-0 grayscale-0",
          {
            "rounded-full": rounded,
          }
        )}
        alt={alt}
        {...rest}
        onLoadingComplete={() => setIsLoading(false)}
        draggable={false}
      />
    </div>
  ) : (
    <div className={cn("shrink-0 overflow-hidden", className)}>
      <Image
        src={src!}
        height={height}
        width={width}
        className={cn(
          "duration-700 ease-in-out group-hover:opacity-75 [&>img]:inline-block",
          isLoading
            ? "scale-110 blur-2xl grayscale"
            : "scale-100 blur-0 grayscale-0",
          {
            "rounded-full": rounded,
          }
        )}
        alt={alt}
        {...rest}
        onLoadingComplete={() => setIsLoading(false)}
        draggable={false}
      />
    </div>
  );
};
