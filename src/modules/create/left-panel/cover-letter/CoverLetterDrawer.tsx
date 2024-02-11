import { RiDraftLine } from "react-icons/ri";

import { BlurImage } from "~/components";
import { Blur } from "~/components/Blur";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHandle,
} from "~/components/ui/external/Drawer";
import { Text } from "~/components/ui/inputs/Text";
import { FormContext } from "~/modules/preferences/my-info/FormContext";
import { usePersistentData } from "~/hooks/usePersistentData";
import { useCurrentDraft } from "~/hooks/useCurrentDraft";
import { TextEditor } from "./TextEditor";
import { NAV_BUTTON_CN } from "../constants";
import { cn } from "~/utils";

const { log } = console;

export const CoverLetterDrawer = () => {
  const { currentDraft } = useCurrentDraft();
  const { ls } = usePersistentData();

  const { user } = ls;
  const { vacancy } = currentDraft ?? {};

  const defaultValues = user &&
    vacancy && {
      "file-name": `${user?.name}. Cover letter for ${vacancy?.companyName}`,
    };

  return (
    <Drawer>
      <DrawerTrigger
        className={cn(NAV_BUTTON_CN, "gap-2")}
        suppressHydrationWarning
      >
        <Blur element={<RiDraftLine />} />
        Cover letter
      </DrawerTrigger>
      {defaultValues && (
        <FormContext
          form={{
            defaultValues,
          }}
        >
          {({ control }) => (
            <DrawerContent className="flex h-screen flex-col gap-5 bg-primary clr-primary">
              <header className="grid grid-cols-3 gap-2 p-5">
                {/* Enter file name */}
                <label className="flex-y gap-4 whitespace-nowrap text-[0.8rem]">
                  File name:
                  <Text
                    name="file-name"
                    control={control}
                    className="outlined"
                  />
                </label>

                {/* Handle  */}
                <DrawerHandle parentCn="!col-span-1" />

                {/* Company name on the right */}
                <span className="flex-y justify-end font-normal">
                  <BlurImage
                    src={vacancy?.image}
                    height={40}
                    width={40}
                    className="ml-4 mr-2 shrink-0 rounded-full"
                  />
                  <b>{vacancy?.companyName}</b>
                </span>
              </header>

              {/* Editor toolbar and Textarea */}
              <TextEditor vacancy={vacancy} user={user} />
            </DrawerContent>
          )}
        </FormContext>
      )}
    </Drawer>
  );
};
