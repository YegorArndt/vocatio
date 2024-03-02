import { BiDownload } from "react-icons/bi";
import { Button } from "~/components/ui/buttons/Button";
import { useDesignContext } from "../design/contexts/DesignContext";
import { NAV_BUTTON_CN } from "./constants";
import jsPDF from "jspdf";
import { RefObject } from "react";
import { toast } from "sonner";
import { eventManager } from "~/modules/events/EventManager";
import { Events } from "~/modules/events/types";
import { stripHtmlTags } from "~/modules/utils";
import { A4_HEIGHT, A4_WIDTH } from "../design/constants";
import { CvContextManager } from "~/modules/CvContextManager";
import html2canvas from "html2canvas";
import { Cv } from "~/modules/init-gen/types";

const { log } = console;

export const DownloadButton = () => {
  const { a4Ref } = useDesignContext();

  return (
    <Button
      frontIcon={<BiDownload />}
      text="Download PDF"
      className={NAV_BUTTON_CN}
      onClick={() => void downloadPdf({ a4Ref })}
    />
  );
};

/**
 * Download & ATS handlers. ✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨
 */

export const getStructuredCvText = (cv: Cv): string => {
  let formattedText = "";

  /**
   * Name, job title, professional summary
   */
  formattedText += `NAME: ${cv.userName}.\n`;
  if (cv.jobTitle) formattedText += `JOB TITLE: ${cv.jobTitle}.\n`;

  formattedText += `PROFESSIONAL SUMMARY: ${cv.summary}.\n`;

  /**
   * Contact
   */
  if (cv.contact && cv.contact.length > 0) {
    formattedText += `  CONTACT: `;
    cv.contact.forEach((entry) => {
      formattedText += ` ${entry.name}: ${entry.value} |`;
    });
  }

  formattedText += `\n`;

  /**
   *  Education
   */
  if (cv.education && cv.education.length > 0) {
    formattedText += `  EDUCATION:\n `;
    cv.education.forEach((entry) => {
      formattedText += `  University: ${entry.place}, Degree: ${
        entry.title
      }, Period: ${entry.period}, description: ${entry.bullets
        .map((x) => x.text)
        .join("\n")}\n`;
    });
  }

  /**
   * Employment History
   */
  if (cv.experience && cv.experience.length > 0) {
    formattedText += `   EXPERIENCE:\n `;
    cv.experience.forEach((entry) => {
      formattedText += `  Company name: ${entry.place}, Job title: ${
        entry.title
      }, Period of employment: ${entry.period}, description: ${entry.bullets
        .map((x) => x.text)
        .join("\n")}\n`;
    });
  }

  /**
   * Skills
   */
  if (cv.skills && cv.skills.length > 0) {
    formattedText += `  SKILLS:\n`;
    cv.skills.forEach((skill) => {
      formattedText += `${skill.name}, `;
    });
  }

  return stripHtmlTags(formattedText);
};

type DownloadPdfProps = {
  a4Ref: RefObject<HTMLDivElement>;
};

export const downloadPdf = async (props: DownloadPdfProps) => {
  const { a4Ref } = props;
  if (!a4Ref.current) return;

  const cv = CvContextManager.getInstance().getCv();
  const gen = CvContextManager.getInstance().getGen();

  if (!cv || !gen) return;

  toast.info("Preparing your PDF...");

  const a4 = a4Ref.current;
  const pageCount = Math.ceil(a4.clientHeight / A4_HEIGHT);
  const pdf = new jsPDF({
    format: "a4",
    orientation: "portrait",
    unit: "px",
  });

  const width = pdf.internal.pageSize.getWidth();
  const height = pdf.internal.pageSize.getHeight();

  const cvText = getStructuredCvText(cv);
  pdf.setFontSize(0);
  const maxWidth = width - 40; // 20px margin on each side
  const lines: string[] = pdf.splitTextToSize(cvText, maxWidth);

  let lineIndex = 0;
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
    if (i > 0) pdf.addPage();
    pdf.addImage(imgData, "PNG", 0, 0, width, height, undefined, "SLOW");

    // Adding text starting from the current page
    let yPos = 10;
    while (lineIndex < lines.length) {
      if (yPos > height - 10) break; // Check if we are at the end of the page
      // @ts-ignore
      pdf.text(lines[lineIndex], 20, yPos);
      yPos += 10;
      lineIndex++;
    }
  }

  pdf.save(`${cv.fileName}.pdf`);
  eventManager.emit(Events.DOWNLOAD_FIRED);
};
