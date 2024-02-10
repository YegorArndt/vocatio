import { SlMagnifier } from "react-icons/sl";
import {
  DrawerContent,
  Drawer,
  DrawerHandle,
  DrawerTrigger,
} from "~/components/ui/external/Drawer";
import { Diff } from "./toolbar/Diff";
import { Badge } from "~/components/ui/external/Badge";

const { log } = console;

export const DiffDrawer = () => {
  return (
    <Drawer>
      <DrawerTrigger className="nav-button !gap-2">
        <SlMagnifier /> Review changes <Badge>Beta</Badge>
      </DrawerTrigger>
      <DrawerContent className="max-h-[95vh] bg-primary px-10 py-5">
        <DrawerHandle />
        <Diff />
      </DrawerContent>
    </Drawer>
  );
};
