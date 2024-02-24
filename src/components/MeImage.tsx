import { api } from "~/utils";
import { BlurImage } from "./BlurImage";

const { log } = console;

export const MeImage = () => {
  const { data: user } = api.users.get.useQuery();

  return (
    <BlurImage
      src={user?.image}
      className="!overflow-visible"
      rounded
      height={20}
      width={20}
      fallback={<div className="skeleton h-[20px] w-[20px] rounded-full" />}
    />
  );
};
