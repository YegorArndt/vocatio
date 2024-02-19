import { BiDownload } from "react-icons/bi";
import { Button } from "~/components/ui/buttons/Button";
import { useGeneratedData } from "~/hooks/useGeneratedData";
import { useDesignContext } from "../../design/contexts/DesignContext";
import { downloadPdf } from "../utils";
import { NAV_BUTTON_CN } from "../constants";
import { toast } from "sonner";
import { MoveToAppliedToast } from "./MoveToAppliedToast";

const { log } = console;

export const DownloadButton = () => {
  const { a4Ref } = useDesignContext();
  const { generated } = useGeneratedData();

  if (!generated) return null;

  return (
    <Button
      frontIcon={<BiDownload />}
      text="Download PDF"
      className={NAV_BUTTON_CN}
      onClick={() =>
        void downloadPdf({ a4Ref, draft: generated }).then(() => {
          toast.info(<MoveToAppliedToast />, {
            duration: 10000,
          });
        })
      }
    />
  );
};
