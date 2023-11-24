import { Active, UniqueIdentifier } from "@dnd-kit/core";
import { defaultAnimateLayoutChanges } from "@dnd-kit/sortable";
import { SortableTransition } from "@dnd-kit/sortable/dist/hooks/types";

import { IT_COMPANY_NAMES } from "./constants";
import { User, Vacancy } from "@prisma/client";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { snakeCase } from "lodash-es";
import { RefObject } from "react";

export const getRandomCompanyName = () => {
  const randomIndex = Math.floor(Math.random() * IT_COMPANY_NAMES.length);
  return IT_COMPANY_NAMES[randomIndex] || "Google";
};

type AnimateLayoutChanges = {
  active: Active | null;
  containerId: UniqueIdentifier;
  isDragging: boolean;
  isSorting: boolean;
  id: UniqueIdentifier;
  index: number;
  items: UniqueIdentifier[];
  previousItems: UniqueIdentifier[];
  previousContainerId: UniqueIdentifier;
  newIndex: number;
  transition: SortableTransition | null;
  wasDragging: boolean;
};

export const animateLayoutChanges = (args: AnimateLayoutChanges) => {
  const { isSorting } = args;

  if (isSorting) {
    return defaultAnimateLayoutChanges(args);
  }

  return true;
};

export const downloadPdf = async (
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
