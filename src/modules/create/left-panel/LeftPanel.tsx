import { useGeneratedData } from "~/hooks/useGeneratedData";
import { Link } from "~/components/ui/buttons/Link";
import { CoverLetterDrawer } from "./cover-letter/CoverLetterDrawer";
import { NAV_BUTTON_CN } from "./constants";
import { DownloadButton } from "./download/DownloadButton";
import { LinkedinColor } from "~/components/icons";
import { BackButton } from "./BackButton";
import { FontFamilyButton } from "./FontFamilyButton";
import { MoveToAppliedSwitch } from "./MoveToAppliedSwitch";
import { Button } from "~/components/ui/buttons/Button";
import { IoMdAnalytics } from "react-icons/io";

export const LeftPanel = () => {
  const { generated } = useGeneratedData();

  return (
    <nav className="fixed z-layout ml-3 mt-6 flex h-[85%] flex-col gap-3">
      <BackButton />
      {generated?.vacancy?.sourceUrl && (
        <Link
          frontIcon={<LinkedinColor fontSize={18} />}
          text="Back to job posting"
          to={generated.vacancy.sourceUrl}
          className={NAV_BUTTON_CN}
          newTab
        />
      )}
      <CoverLetterDrawer />
      <Button
        frontIcon={<IoMdAnalytics />}
        text="Analyze chances"
        className={NAV_BUTTON_CN}
        disabled
      />
      <DownloadButton />
      <FontFamilyButton />
      <footer className="mt-8 flex flex-col gap-3">
        {/* <SpellCheckSwitch /> */}
        <MoveToAppliedSwitch />
      </footer>
    </nav>
  );
};
