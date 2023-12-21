import Image, { type ImageProps as NextImageProps } from "next/image";
import cn from "classnames";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";

import { api } from "~/utils";

export type ImageProps = Partial<NextImageProps>;

export const UserImage = (props: ImageProps) => {
  const { height = 100, width = 100, className, ...rest } = props;
  const [isLoading, setIsLoading] = useState(true);
  const defaultUserData = useUser();
  const { data: user } = api.users.get.useQuery();

  const src = user?.image || defaultUserData.user?.imageUrl;

  return (
    <div
      className={cn("bg-gray-200 overflow-hidden rounded-full", className)}
      style={{ height, width }}
    >
      <Image
        src={src!}
        alt={defaultUserData.user?.fullName || "User-image"}
        height={height}
        width={width}
        objectFit="cover"
        className={cn(
          "duration-700 ease-in-out group-hover:opacity-75",
          isLoading
            ? "scale-110 blur-2xl grayscale"
            : "scale-100 blur-0 grayscale-0"
        )}
        {...rest}
        onLoadingComplete={() => setIsLoading(false)}
        draggable={false}
      />
    </div>
  );
};
