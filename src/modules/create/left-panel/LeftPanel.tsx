import { NavigationLink } from "~/components";
import { mainNav } from "~/components/layout/constants";
import { DiffDrawer } from "./diff/DiffDrawer";
import { useGeneratedData } from "~/hooks/useGeneratedData";
import { Link } from "~/components/ui/buttons/Link";
import { CoverLetterDrawer } from "./cover-letter/CoverLetterDrawer";
import { NAV_BUTTON_CN } from "./constants";
import { Divider } from "~/components/layout/Divider";
import { DownloadButton } from "./download/DownloadButton";
import { LinkedinColor } from "~/components/icons";

export const LeftPanel = () => {
  const { generated } = useGeneratedData();

  return (
    <nav className="fixed ml-5 mt-16 flex flex-col gap-3">
      {mainNav.map((link) => (
        <NavigationLink
          key={link.props.to}
          baseCn={NAV_BUTTON_CN}
          {...link.props}
        />
      ))}
      <Divider />
      <CoverLetterDrawer />
      <DiffDrawer />
      <DownloadButton />
      {generated?.vacancy?.sourceUrl && (
        <Link
          frontIcon={<LinkedinColor fontSize={18} />}
          text="Back to job posting"
          to={generated.vacancy.sourceUrl}
          className={NAV_BUTTON_CN}
          newTab
        />
      )}
    </nav>
  );
};
