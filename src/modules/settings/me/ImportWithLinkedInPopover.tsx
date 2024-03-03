import { LiaExternalLinkAltSolid } from "react-icons/lia";
import { BlurImage } from "~/components";
import { LinkedinColor } from "~/components/icons";
import { ButtonProps } from "~/components/ui/buttons/Button";
import { Link } from "~/components/ui/buttons/Link";
import { Badge } from "~/components/ui/external/Badge";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "~/components/ui/external/Popover";
import { linkedinBaseUrl } from "~/modules/constants";

const { log } = console;

export const ImportWithLinkedInPopover = (props: ButtonProps) => {
  const { text = "Import with LinkedIn" } = props;
  return (
    <Popover>
      <PopoverTrigger className="primary sm !justify-start gap-2">
        <LinkedinColor fontSize={25} /> {text}
      </PopoverTrigger>
      <PopoverContent
        onClick={(e) => e.stopPropagation()}
        side="right"
        className="w-max"
      >
        <div className="size-full grid grid-cols-2 gap-5 overflow-auto">
          <section className="flex max-w-[450px] flex-col gap-2">
            {[
              "Open the Vocatio extension while on LinkedIn.",
              'Click "Export my profile to Vocatio".',
            ].map((intruction, i) => (
              <div key={i} className="flex-y gap-2">
                <Badge>{i + 1}</Badge>
                {intruction}
              </div>
            ))}
            <Link
              frontIcon={<LiaExternalLinkAltSolid />}
              text="Open my LinkedIn profile"
              to={linkedinBaseUrl}
              className="flex-y my-5 gap-1 clr-blue"
              newTab
            />
            <footer className="clr-ghost mt-auto">
              Vocatio will open and read each of your LinkedIn sections (like
              experience, education, etc.) and create the corresponding fields
              in your Vocatio profile automatically for you.
            </footer>
          </section>
          <section>
            <BlurImage
              src="/export-profile-screenshot.png"
              height={350}
              width={350}
            />
          </section>
        </div>
      </PopoverContent>
    </Popover>
  );
};
