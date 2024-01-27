import { useUser } from "@clerk/nextjs";

import { BlurImage } from "~/components";
import { usePersistentData } from "~/hooks/usePersistentData";

const { log } = console;

export const ImageBox = () => {
  const defaultUserData = useUser();
  const { ls } = usePersistentData();

  const image = ls.user?.image || defaultUserData.user?.imageUrl;

  return (
    ls.user && (
      <div className="flex justify-between pb-8">
        Your default CV image. Anytime update with LinkedIn.
        <BlurImage
          src={image}
          height={150}
          width={150}
          className="-ml-10 rounded-full"
        />
      </div>
    )
  );
};
