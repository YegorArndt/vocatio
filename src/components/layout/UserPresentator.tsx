import { SignOutButton, useUser } from "@clerk/nextjs";
import { Menu, MenuButton, MenuItem } from "@szhsin/react-menu";
import { UserImage } from "~/modules/create/components/UserImage";
import { api } from "~/utils";
import { Chip } from "../Chip";

export const UserPresentator = () => {
  const { data: user } = api.users.get.useQuery();
  const defaultUserData = useUser();

  return (
    <div className="flex w-full items-center justify-normal gap-4 pl-3 pt-5">
      <span className="font-logo text-[40px]">Vocatio</span>
      <div className="h-[30px] w-[0.5px] rotate-[30deg] transform bg-base-reversed" />
      <Menu
        menuButton={
          <MenuButton className="flex-center gap-3">
            <UserImage height={30} width={30} />
            <span className="text-sm">
              {user?.ownName || defaultUserData.user?.fullName}
            </span>
          </MenuButton>
        }
        direction="right"
      >
        <MenuItem>
          <SignOutButton>Log out</SignOutButton>
        </MenuItem>
      </Menu>
      <Chip className="sm">Free</Chip>
    </div>
  );
};
