import { Spinner } from "~/components";
import { Blur } from "~/components/Blur";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHandle,
} from "~/components/ui/external/Drawer";
import { FormContext } from "~/components/FormContext";
import { TextEditor } from "./TextEditor";
import { NAV_BUTTON_CN } from "../constants";
import { api, cn } from "~/utils";
import { Fragment } from "react";
import { Text } from "~/components/ui/inputs/Text";
import { useCvContext } from "~/hooks/useCvContext";
import { CompanyPresentator } from "../../CompanyPresentator";
import { Gpt } from "~/components/icons";

const { log } = console;

export const CoverLetterDrawer = () => {
  const { data: user } = api.users.get.useQuery();
  const { gen } = useCvContext() ?? {};

  if (!gen?.vacancy) return <Spinner size={10} />;
  const { vacancy } = gen;

  const defaultValues = user &&
    vacancy && {
      "file-name": `${user?.name}. Cover letter for ${vacancy?.companyName}`,
    };

  return (
    <Drawer>
      <DrawerTrigger
        className={cn(NAV_BUTTON_CN, "gap-2")}
        suppressHydrationWarning
        disabled={!!!defaultValues}
      >
        <Blur element={<Gpt />} />
        Generate cover letter
      </DrawerTrigger>
      <DrawerContent className="flex h-screen flex-col gap-5 bg-primary clr-primary">
        {defaultValues && (
          <FormContext
            form={{
              defaultValues,
            }}
          >
            {({ control }) => (
              <Fragment>
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

                  <div className="flex-y justify-end gap-3">
                    Writing cover letter for
                    <CompanyPresentator />
                  </div>
                </header>

                {/* Editor toolbar and Textarea */}
                <TextEditor vacancy={vacancy} user={user} />
              </Fragment>
            )}
          </FormContext>
        )}{" "}
      </DrawerContent>
    </Drawer>
  );
};
