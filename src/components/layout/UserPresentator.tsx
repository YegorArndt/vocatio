import { useUser } from "@clerk/nextjs";
import { UserImage } from "~/modules/create/components/UserImage";
import { api } from "~/utils";

export const UserPresentator = () => {
  const { data: user } = api.users.get.useQuery();
  const defaultUserData = useUser();

  return (
    <div className="flex w-full items-center justify-normal gap-4 pl-3 pt-5">
      <span>Welcome to Careerpilot Beta 😉</span>
      <div className="h-[30px] w-[0.5px] rotate-[30deg] transform bg-base-reversed" />
      <UserImage height={30} width={30} />
      <span className="text-sm">
        {user?.ownName || defaultUserData.user?.fullName}
      </span>
    </div>
  );
};
