import { LsDraft } from "../../types";
import { RouterOutputs } from "~/utils/api";
import { stripHtmlTags } from "~/modules/utils";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { RefObject } from "react";
import { A4_HEIGHT, A4_WIDTH } from "../../constants";
import { RouterUser } from "~/modules/extension/types";

const { log } = console;

export const getStructuredCvText = (
  user: RouterOutputs["users"]["get"],
  draft: LsDraft
): string => {
  let formattedText = "";

  /**
   * Name, job title, professional summary
   */
  formattedText += `NAME: ${user.name}.\n`;
  if (user.jobTitle) formattedText += `JOB TITLE: ${draft.jobTitle}.\n`;

  formattedText += `PROFESSIONAL SUMMARY: ${draft.professionalSummary}.\n`;

  /**
   * Contact
   */
  if (user.contact && user.contact.length > 0) {
    formattedText += `  CONTACT: `;
    user.contact.forEach((entry) => {
      formattedText += ` ${entry.name} - ${entry.value} |`;
    });
  }

  formattedText += `\n`;

  /**
   *  Education
   */
  if (user.education && user.education.length > 0) {
    formattedText += `  EDUCATION:\n `;
    user.education.forEach((history) => {
      formattedText += `  University: ${history.place}, Degree: ${history.title}, Period: ${history.period}, Description: ${history.description}\n`;
    });
  }

  /**
   * Employment History
   */
  if (draft.experience && draft.experience.length > 0) {
    formattedText += `   WORK EXPERIENCE:\n `;
    draft.experience.forEach((history) => {
      formattedText += `  Company name: ${history.place}, Job title: ${history.title}, Period of employment: ${history.period}, description: ${history.description}\n`;
    });
  }

  /**
   * Skills
   */
  if (user.skills && user.skills.length > 0) {
    formattedText += `  SKILLS:\n`;
    user.skills.forEach((skill) => {
      formattedText += ` - ${skill.name} `;
    });
  }

  return stripHtmlTags(formattedText);
};

type DownloadPdfProps = {
  a4Ref: RefObject<HTMLDivElement>;
  user: RouterUser;
  draft: LsDraft;
};

export const downloadPdf = async (props: DownloadPdfProps) => {
  const { a4Ref, user, draft } = props;
  const a4 = a4Ref.current;
  if (!a4) return;

  const pageCount = Math.ceil(a4.clientHeight / A4_HEIGHT);

  const pdf = new jsPDF({
    format: "a4",
    orientation: "portrait",
    unit: "px",
  });

  const width = pdf.internal.pageSize.getWidth();
  const height = pdf.internal.pageSize.getHeight();

  for (let i = 0; i < pageCount; i++) {
    const yOffset = i * A4_HEIGHT;

    const canvas = await html2canvas(a4, {
      width: A4_WIDTH,
      height: A4_HEIGHT,
      windowHeight: A4_HEIGHT,
      windowWidth: A4_WIDTH,
      y: yOffset,
      scrollY: -yOffset,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");

    if (i > 0) {
      pdf.addPage();
    }

    pdf.addImage(imgData, "PNG", 0, 0, width, height, undefined, "SLOW");
  }

  // Address ATS
  const cvText = getStructuredCvText(user, draft);
  pdf.setFontSize(0);

  // // Width for text wrapping
  const maxWidth = pdf.internal.pageSize.getWidth() - 40; // 20px margin on each side
  const lines: string[] = pdf.splitTextToSize(cvText, maxWidth);

  // Start from the top of the first page
  let yPos = 10; // Start from the top
  lines.forEach((line: string) => {
    if (yPos > pdf.internal.pageSize.getHeight() - 10) {
      pdf.addPage();
      yPos = 10; // Start from the top for new pages
    }
    pdf.text(line, 20, yPos); // 20px left margin
    yPos += 10; // Line height
  });

  pdf.save(`${user.name}. CV for ${draft.vacancy.companyName}.pdf`);
};
