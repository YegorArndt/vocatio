import { Fragment } from "react";
import {
  DrawerContent,
  Drawer,
  DrawerHandle,
  DrawerTrigger,
} from "~/components/ui/external/Drawer";
import { Gpt } from "~/components/icons";
import {
  EnhancementResult,
  LeftEnhanceBox,
  RightEnhanceBox,
} from "./components";
import { api } from "~/utils";

const { log } = console;

export const EnhanceExperienceDrawer = () => {
  const { data: user } = api.users.get.useQuery();

  return (
    <Drawer>
      <DrawerTrigger
        className="flex-y ml-5 gap-2 whitespace-nowrap rounded-md bg-blue px-2 py-1 text-sm text-white"
        disabled={!!!user?.experience.length}
      >
        <Gpt /> Enhance with AI
      </DrawerTrigger>
      <DrawerContent className="h-full bg-primary py-5">
        <DrawerHandle />
        <div className="size-full overflow-auto px-10">
          <Fragment>
            <div className="mt-11 grid grid-cols-2 gap-8">
              <LeftEnhanceBox />
              <RightEnhanceBox />
            </div>
            <EnhancementResult />
          </Fragment>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
