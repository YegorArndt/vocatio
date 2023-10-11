import { RefObject, useState } from "react";
import cn from "classnames";
import { AiOutlineCheck, AiOutlineCloudDownload } from "react-icons/ai";
import { BiRefresh } from "react-icons/bi";
import { TfiLayersAlt } from "react-icons/tfi";
import { FaTrash } from "react-icons/fa";

import { BaseButton } from "~/components/ui";
import {
  DELETE_FIRED,
  DOWNLOAD_FIRED,
  REARRANGING_FIRED,
  RESTORE_TO_DEFAULTS_FIRED,
  SAVE_FIRED,
} from "../draft/actions";
import type { ActionType } from "../draft/types";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useDraftContext } from "../draft/DraftProvider";

type ToolbarProps = {
  a4Ref: RefObject<HTMLDivElement>;
};

/**
 * All actions fired by toolbar buttons are handled by DraftProvider's reducer.
 */

type ToolProps = {
  tool: (typeof tools)[number];
  isSelected: boolean;
  onClick: () => void;
};

const getPdf = async (a4Ref: RefObject<HTMLDivElement>) => {
  const a4 = a4Ref.current;

  if (!a4) return;

  /**
   * Convert HTML to Canvas
   */
  const canvas = await html2canvas(a4);

  /**
   * Initialize jsPDF
   */
  const pdf = new jsPDF("p", "mm", "a4");

  /**
   * Add canvas to jsPDF
   */
  const imgData = canvas.toDataURL("image/png");
  pdf.addImage(imgData, "PNG", 0, 0, 210, 297);

  /**
   * Save PDF
   */
  pdf.save("download.pdf");
};

const tools: { action: ActionType; icon: any }[] = [
  {
    action: DOWNLOAD_FIRED,
    icon: AiOutlineCloudDownload,
  },
  {
    action: SAVE_FIRED,
    icon: AiOutlineCheck,
  },
  {
    action: REARRANGING_FIRED,
    icon: TfiLayersAlt,
  },
  {
    action: DELETE_FIRED,
    icon: FaTrash,
  },
  {
    action: RESTORE_TO_DEFAULTS_FIRED,
    icon: BiRefresh,
  },
];

const active = "scale-95 shadow-md active !clr-base";

const Tool = (props: ToolProps) => {
  const { tool, isSelected, onClick } = props;

  return (
    <BaseButton
      baseCn="hoverable rounded-sm p-5 transition transform hover:-translate-y-1 motion-reduce:transition-none"
      className={cn({ [active]: isSelected })}
      onClick={onClick}
    >
      <tool.icon />
    </BaseButton>
  );
};

export const Toolbar = (props: ToolbarProps) => {
  const [selectedAction, setSelectedAction] = useState<ActionType | null>(null);
  const {
    dispatch,
    reset,
    state: { isRearranging },
  } = useDraftContext();

  return (
    <div className="palette-secondary fixed left-[1rem] top-[10rem] grid grid-cols-2 items-center p-1">
      {tools.map((tool) => (
        <Tool
          key={tool.action}
          tool={tool}
          isSelected={selectedAction === tool.action}
          onClick={() => {
            setSelectedAction(tool.action);
            dispatch({
              type: tool.action,
              payload: {
                isRearranging:
                  !isRearranging && tool.action === REARRANGING_FIRED,
              },
            });
          }}
        />
      ))}
    </div>
  );
};
