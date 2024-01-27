import { RiDraftLine } from "react-icons/ri";

import { BlurImage } from "~/components";
import { Blur } from "~/components/Blur";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHandle,
} from "~/components/ui/external/Drawer";
import { useDraftContext } from "../../DraftContext";
import { Text } from "~/components/ui/inputs/Text";
import { FormContext } from "~/modules/preferences/my-info/FormContext";
import { TextEditor } from "./TextEditor";
import { usePersistentData } from "~/hooks/usePersistentData";

const { log } = console;

export const CoverLetterDrawer = () => {
  const { draft } = useDraftContext();
  const { ls } = usePersistentData();

  const { user } = ls;
  const { vacancy } = draft;

  const defaultValues = user &&
    vacancy && {
      "file-name": `${user?.name}. Cover letter for ${vacancy?.companyName}`,
    };

  return (
    <Drawer>
      <DrawerTrigger
        className="common hover flex-y gap-3"
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
                <DrawerHandle />

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
