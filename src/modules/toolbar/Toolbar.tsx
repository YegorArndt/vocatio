import { RefObject } from "react";
import { AiOutlineCheck } from "react-icons/ai";
import { TfiLayersAlt } from "react-icons/tfi";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useDraftContext } from "../draft/DraftContext";
import { Button } from "~/components/ui/buttons/Button";

type ToolbarProps = {
  a4Ref: RefObject<HTMLDivElement>;
};

/**
 * All actions fired by toolbar buttons are handled by DraftProvider's reducer.
 */

type ToolProps = {
  icon: any;
  onClick: () => void;
};

const getPdf = async (a4Ref: RefObject<HTMLDivElement>) => {
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
  pdf.save("download.pdf");
};

const Tool = (props: ToolProps) => {
  const { icon, onClick } = props;

  return (
    <Button
      baseCn="p-5 transition transform hover:-translate-y-1 motion-reduce:transition-none"
      onClick={onClick}
    >
      {icon}
    </Button>
  );
};

export const Toolbar = (props: ToolbarProps) => {
  const { a4Ref } = props;

  const { setDownloadFired } = useDraftContext();

  const tools = [
    {
      icon: <AiOutlineCheck />,
      onClick: async () => {
        setDownloadFired(true);
        await getPdf(a4Ref);
        setDownloadFired(false);
      },
    },
    {
      icon: <TfiLayersAlt />,
    },
  ];

  return (
    <div className="palette-secondary fixed left-[1rem] top-[10rem] grid grid-cols-2 items-center p-1">
      {tools.map((tool, index) => (
        <Tool key={index} {...tool} />
      ))}
    </div>
  );
};
