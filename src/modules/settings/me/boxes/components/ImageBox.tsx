import { useUser } from "@clerk/nextjs";

import { BlurImage } from "~/components";
import { api } from "~/utils";

const { log } = console;

export const ImageBox = () => {
  const defaultUserData = useUser();
  const { data: user } = api.users.get.useQuery();
  const image = user?.image || defaultUserData.user?.imageUrl;

  return (
    user && (
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
