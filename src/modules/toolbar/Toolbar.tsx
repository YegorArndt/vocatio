import { RefObject } from "react";
import Image from "next/image";
import { snakeCase } from "lodash-es";
import cn from "classnames";
import type { User, Vacancy } from "@prisma/client";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Tooltip } from "react-tooltip";

import { useDraftContext } from "../draft/DraftContext";
import { Button } from "~/components/ui/buttons/Button";

type ToolbarProps = {
  a4Ref: RefObject<HTMLDivElement>;
};

/**
 * All actions fired by toolbar buttons are handled by DraftProvider's reducer.
 */

type ToolProps = {
  src: string;
  onClick: () => void;
  isActive: boolean | undefined;
  tooltip: string;
  tooltipOnActive: string;
};

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
    unit: "px",
    format: "a4",
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

const Tool = (props: ToolProps) => {
  const { src, onClick, isActive, tooltip, tooltipOnActive } = props;

  return (
    <Button
      baseCn="p-1 navigation transition transform hover:-translate-y-1 motion-reduce:transition-none"
      className={cn({
        "-translate-y-1 transform !bg-secondary-hover transition": isActive,
      })}
      onClick={onClick}
      data-tooltip-id={src}
    >
      <Image
        src={`/${src}.png`}
        height={50}
        width={50}
        alt={src}
        className="rounded-lg"
      />
      <Tooltip id={src} place="bottom" content={tooltip} />
      <Tooltip
        id={src}
        place="bottom"
        content={tooltipOnActive}
        isOpen={isActive}
      />
    </Button>
  );
};

export const Toolbar = (props: ToolbarProps) => {
  const { a4Ref } = props;

  const {
    user: { ownName },
    vacancy: { companyName },
    draftState: { REARRANGING_FIRED, DOWNLOAD_FIRED },
    dispatchers: { setDownloadFired, setRearrangeFired },
  } = useDraftContext();

  const tools: ToolProps[] = [
    {
      src: "download",
      onClick: async () => {
        setDownloadFired(true);
        await getPdf(a4Ref, ownName, companyName);
        setDownloadFired(false);
      },
      isActive: DOWNLOAD_FIRED,
      tooltip: "Download",
      tooltipOnActive: "Downloading...",
    },
  ];

  return (
    <div className="fixed left-[1rem] top-[10rem] grid grid-cols-2 items-center gap-1 rounded-md border p-2">
      {tools.map((tool, index) => (
        <Tool key={index} {...tool} />
      ))}
    </div>
  );
};
