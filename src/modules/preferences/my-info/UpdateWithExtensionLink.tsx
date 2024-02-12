import { Link } from "~/components/ui/buttons/Link";
import { LiaExternalLinkAltSolid } from "react-icons/lia";
import {
  TooltipTrigger,
  TooltipContent,
  Tooltip,
  TooltipProvider,
} from "~/components/ui/external/Tooltip";
import { toast } from "sonner";
import { LinkedinColor } from "~/components/icons";
import { linkedinBaseUrl } from "~/modules/constants";
import { BoxName } from "./types";

export const UpdateWithExtensionLink = (props: {
  boxName: BoxName;
  linkedinId: string | null | undefined;
  className?: string;
}) => {
  const { boxName, linkedinId, className } = props;

  /**
   * You can redirect the user to linkedinBaseUrl and LinkedIn will recognize the user anyway.
   * However, redirecting to a specific profile section without the LinkedIn ID will not work.
   */
  const baseUrlWorks = ["main", "contact", "image"].includes(boxName);
  const to = baseUrlWorks ? "" : `${linkedinId}/details/${boxName}`;
  const disabled = !linkedinId && !baseUrlWorks;

  return disabled ? (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger
          className="flex-y cursor-not-allowed text-sm"
          onClick={(e) => e.stopPropagation()}
        >
          ⚠️&nbsp;&nbsp;Update main section
        </TooltipTrigger>
        <TooltipContent>
          This will also update the Contact section adding your LinkedIn ID. It
          is needed in order to navigate to your LinkedIn {boxName} section.
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ) : (
    <Link
      frontIcon={<LiaExternalLinkAltSolid size={23} />}
      text="Update with extension via:"
      endIcon={<LinkedinColor fontSize={23} />}
      to={`${linkedinBaseUrl}${to}`}
      onClick={(e) => {
        e.stopPropagation();
        toast.info(
          `Open the extension while on LinkedIn and click "Update ${boxName}"`,
          {
            duration: 10000,
          }
        );
      }}
      baseCn="flex-y hover:underline text-[1rem]"
      className={className}
      newTab
    />
  );
};
