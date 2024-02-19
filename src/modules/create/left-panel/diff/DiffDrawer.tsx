import { SlMagnifier } from "react-icons/sl";
import {
  DrawerContent,
  Drawer,
  DrawerHandle,
  DrawerTrigger,
} from "~/components/ui/external/Drawer";
import { Diff } from "./Diff";
import { Badge } from "~/components/ui/external/Badge";
import { NAV_BUTTON_CN } from "../constants";
import { cn } from "~/utils";

const { log } = console;

export const DiffDrawer = () => {
  return (
    <Drawer>
      <DrawerTrigger className={cn(NAV_BUTTON_CN, "gap-2")} disabled>
        <SlMagnifier /> Review changes <Badge>Soon</Badge>
      </DrawerTrigger>
      <DrawerContent className="max-h-[95vh] bg-primary px-10 py-5">
        <DrawerHandle />
        <Diff />
      </DrawerContent>
    </Drawer>
  );
};
