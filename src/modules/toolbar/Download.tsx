import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { type RefObject } from "react";
import { Tooltip } from "react-tooltip";
import cn from "classnames";

import { Button } from "~/components/ui/buttons/Button";
import { useDraftContext } from "../draft/DraftContext";
import { snakeCase } from "lodash-es";
import { BlurImage } from "~/components/BlurImage";
import { User, Vacancy } from "@prisma/client";

const src = "/download.png";

const downloadPdf = async (
  a4Ref: RefObject<HTMLDivElement>,
  userName: User["ownName"],
  companyName: Vacancy["companyName"] = "cv"
) => {
  const a4 = a4Ref.current;
  if (!a4) return;

  const pageCount = Math.ceil(a4.clientHeight / 1122);

  const pdf = new jsPDF({
    format: "a4",
    orientation: "portrait",
    unit: "px",
  });

  const width = pdf.internal.pageSize.getWidth();
  const height = pdf.internal.pageSize.getHeight();

  for (let i = 0; i < pageCount; i++) {
    const yOffset = i * 1122;

    const canvas = await html2canvas(a4, {
      width: 793,
      height: 1122,
      windowHeight: 1122,
      windowWidth: 793,
      y: yOffset,
      scrollY: -yOffset,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");

    if (i > 0) {
      pdf.addPage();
    }

    pdf.addImage(imgData, "PNG", 0, 0, width, height);
  }

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
    await downloadPdf(a4Ref, ownName, companyName);
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
