import type { User, Vacancy } from "@prisma/client";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { type RefObject } from "react";
import { Tooltip } from "react-tooltip";
import cn from "classnames";

import { Button } from "~/components/ui/buttons/Button";
import { useDraftContext } from "../draft/DraftContext";
import { snakeCase } from "lodash-es";
import { BlurImage } from "~/components/BlurImage";

const src = "/download.png";

const getPdf = async (
  a4Ref: RefObject<HTMLDivElement>,
  userName: User["ownName"],
  companyName: Vacancy["companyName"] = "CV"
) => {
  const a4 = a4Ref.current;

  if (!a4) return;

  await new Promise((resolve) => setTimeout(resolve, 1000));

  /**
   * Convert HTML to Canvas
   */
  const canvas = await html2canvas(a4);

  /**
   * Initialize jsPDF
   */
  const pdf = new jsPDF({
    format: "a4",
    orientation: "portrait",
    unit: "px",
  });

  const width = pdf.internal.pageSize.getWidth();
  const height = pdf.internal.pageSize.getHeight();

  /**
   * Add canvas to jsPDF
   */
  const imgData = canvas.toDataURL("image/png");
  pdf.addImage(imgData, "PNG", 0, 0, width, height);

  /**
   * Save PDF
   */
  pdf.save(`${snakeCase(userName)}_${companyName}.pdf`);
};

export const Download = (props: { a4Ref: RefObject<HTMLDivElement> }) => {
  const { a4Ref } = props;
  const {
    user: { ownName },
    vacancy: { companyName },
    draftState: { DOWNLOAD_FIRED },
    dispatchers: { setDownloadFired },
  } = useDraftContext();

  const onClick = async () => {
    setDownloadFired(true);
    await getPdf(a4Ref, ownName, companyName);
    setDownloadFired(false);
  };

  return (
    <Button
      baseCn="p-1 navigation transition transform hover:-translate-y-1 motion-reduce:transition-none"
      className={cn({
        "-translate-y-1 transform !bg-secondary-hover transition":
          DOWNLOAD_FIRED,
      })}
      onClick={() => void onClick()}
      data-tooltip-id={src}
    >
      <BlurImage
        src={src}
        height={50}
        width={50}
        alt={src}
        className="rounded-lg"
      />
      <Tooltip id={src} place="bottom" content="Download" />
      <Tooltip
        id={src}
        place="bottom"
        content="Downloading..."
        isOpen={DOWNLOAD_FIRED}
      />
    </Button>
  );
};
