import { LinkedinColor } from "~/components/icons";
import { NAV_BUTTON_CN } from "./constants";
import { Link } from "~/components/ui/buttons/Link";
import { useCvContext } from "~/hooks/useCvContext";
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
} from "~/components/ui/external/MenuBar";
import { CiFileOn } from "react-icons/ci";
import { FileName } from "../FileName";
import { DownloadButton } from "./DownloadButton";
import { IoSettingsOutline } from "react-icons/io5";
import { CoverLetterDrawer } from "./cover-letter/CoverLetterDrawer";
import { BoldenKeywordsPopover } from "./BoldenKeywordsPopover";
import { MoveToAppliedSwitch } from "./MoveToAppliedSwitch";
import { MdDashboardCustomize } from "react-icons/md";

const { log } = console;

const BackToJobPosting = () => {
  const { gen } = useCvContext() ?? {};

  return (
    gen &&
    gen.vacancy.sourceUrl && (
      <Link
        frontIcon={<LinkedinColor fontSize={18} />}
        text="Back to job posting"
        to={gen.vacancy.sourceUrl}
        className={NAV_BUTTON_CN}
        newTab
      />
    )
  );
};

export const EditorToolbar = () => {
  return (
    <header className="flex-y my-6 ml-8 flex w-[95%] flex-wrap gap-x-2 rounded-md bg-card p-1">
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger className="primary sm gap-2">
            <CiFileOn /> File
          </MenubarTrigger>
          <MenubarContent className="flex w-max flex-col items-start gap-5 bg-card p-5">
            <FileName />
            <MoveToAppliedSwitch />
          </MenubarContent>
        </MenubarMenu>
      </Menubar>

      <DownloadButton />
      <BackToJobPosting />

      <CoverLetterDrawer />
      <BoldenKeywordsPopover />
      <Link
        frontIcon={<MdDashboardCustomize />}
        text="My vacancies"
        to="/vacancies"
        className="primary sm"
        newTab
      />
      <Link
        frontIcon={<IoSettingsOutline />}
        text="Settings"
        to="/settings/me"
        className="primary sm"
        newTab
      />
    </header>
  );
};
