import { BackButton } from "./BackButton";
import { LinkedinColor } from "~/components/icons";
import { NAV_BUTTON_CN } from "./constants";
import { Link } from "~/components/ui/buttons/Link";
import { useCvContext } from "~/hooks/useCvContext";
import { CoverLetterDrawer } from "./cover-letter/CoverLetterDrawer";
import { IoMdAnalytics } from "react-icons/io";
import { Button } from "~/components/ui/buttons/Button";
import { DownloadButton } from "./DownloadButton";
import { FontFamilyButton } from "./FontFamilyButton";
import { MoveToAppliedSwitch } from "./MoveToAppliedSwitch";
import { BoldenKeywordsPopover } from "./BoldenKeywordsPopover";
import { IoLanguage } from "react-icons/io5";

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

export const LeftPanel = () => {
  return (
    <nav className="fixed z-tooltip ml-3 mt-6 flex h-[85%] flex-col gap-3">
      <BackButton />
      <BackToJobPosting />
      <CoverLetterDrawer />
      <BoldenKeywordsPopover />
      <Button
        frontIcon={<IoMdAnalytics />}
        text="Analyze chances"
        className={NAV_BUTTON_CN}
        disabled
      />
      <Button
        frontIcon={<IoLanguage />}
        text="Translate"
        className={NAV_BUTTON_CN}
        disabled
      />
      <FontFamilyButton />
      <DownloadButton />
      <footer className="mt-8 flex flex-col gap-3">
        <MoveToAppliedSwitch />
      </footer>
    </nav>
  );
};
