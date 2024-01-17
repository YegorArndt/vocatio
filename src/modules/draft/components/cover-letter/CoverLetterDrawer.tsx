import { RiDraftLine } from "react-icons/ri";

import { Spinner, BlurImage } from "~/components";
import { Blur } from "~/components/Blur";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHandle,
} from "~/components/external/Drawer";
import { api } from "~/utils";
import { useDraftContext } from "../../DraftContext";
import { Text } from "~/components/ui/inputs/Text";
import { FormContext } from "~/modules/preferences/FormContext";
import { TextEditor } from "./TextEditor";

const { log } = console;

export const CoverLetterDrawer = () => {
  const { draft } = useDraftContext();

  const { data: user, isLoading: userLoading } = api.users.get.useQuery();
  const { data: vacancy, isLoading: vacancyLoading } =
    api.vacancies.getById.useQuery({ id: draft.vacancyId });

  const defaultValues = user &&
    vacancy && {
      "file-name": `${user?.name} - ${vacancy?.companyName} - Cover Letter`,
    };

  return (
    <Drawer>
      <DrawerTrigger
        className="common hover flex-y gap-3"
        disabled={userLoading || vacancyLoading}
      >
        {userLoading || vacancyLoading ? (
          <Spinner size={10} />
        ) : (
          <Blur element={<RiDraftLine />} />
        )}
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
                <label className="flex-y gap-4 whitespace-nowrap text-[0.8rem]">
                  File name:
                  <Text
                    name="file-name"
                    control={control}
                    className="outlined"
                  />
                </label>

                <DrawerHandle />

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

              {user && vacancy && <TextEditor vacancy={vacancy} user={user} />}
            </DrawerContent>
          )}
        </FormContext>
      )}
    </Drawer>
  );
};
