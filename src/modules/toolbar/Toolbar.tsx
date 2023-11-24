import { RefObject } from "react";

import { BlurImage } from "~/components/BlurImage";
import { Button } from "~/components/ui/buttons/Button";
import { downloadPdf } from "../create/utils";
import { useDraftContext } from "../draft/DraftContext";
import { Bin } from "../bin";

type ToolbarProps = {
  a4Ref: RefObject<HTMLDivElement>;
};

export const Toolbar = (props: ToolbarProps) => {
  const { a4Ref } = props;
  const { user, defaultUserData, vacancy } = useDraftContext();

  return (
    <>
      <Button
        text="Download PDF"
        frontIcon={
          <BlurImage
            src="/download-cloud.png"
            alt="Download"
            height={15}
            width={15}
          />
        }
        onClick={() =>
          void downloadPdf(
            a4Ref,
            user?.ownName ?? (defaultUserData?.fullName as string),
            vacancy?.companyName
          )
        }
        className="common hover flex-center-y gap-1"
      />
      <Bin />
    </>
  );
};
