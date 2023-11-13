import { useState } from "react";
import Image, { type ImageProps } from "next/image";
import cn from "classnames";

export const BlurImage = (props: ImageProps) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="bg-gray-200 xl:aspect-w-7 xl:aspect-h-8 aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg">
      <Image
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        objectFit="cover"
        className={cn(
          "duration-700 ease-in-out group-hover:opacity-75",
          isLoading
            ? "scale-110 blur-2xl grayscale"
            : "scale-100 blur-0 grayscale-0"
        )}
        {...props}
        onLoadingComplete={() => setIsLoading(false)}
      />
    </div>
  );
};
