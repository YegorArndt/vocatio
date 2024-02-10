import { stripHtmlTags } from "~/modules/utils";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { RefObject } from "react";
import { A4_HEIGHT, A4_WIDTH } from "../design/constants";
import { GeneratedDraft } from "../design/types";
import { toast } from "sonner";

const { log } = console;

export const getStructuredCvText = (draft: GeneratedDraft): string => {
  let formattedText = "";

  /**
   * Name, job title, professional summary
   */
  formattedText += `NAME: ${draft.name}.\n`;
  if (draft.jobTitle) formattedText += `JOB TITLE: ${draft.jobTitle}.\n`;

  formattedText += `PROFESSIONAL SUMMARY: ${draft.generatedProfessionalSummary}.\n`;

  /**
   * Contact
   */
  if (draft.contact && draft.contact.length > 0) {
    formattedText += `  CONTACT: `;
    draft.contact.forEach((entry) => {
      formattedText += ` ${entry.name}: ${entry.value} |`;
    });
  }

  formattedText += `\n`;

  /**
   *  Education
   */
  if (draft.education && draft.education.length > 0) {
    formattedText += `  EDUCATION:\n `;
    draft.education.forEach((history) => {
      formattedText += `  University: ${history.place}, Degree: ${history.title}, Period: ${history.period}, Description: ${history.description}\n`;
    });
  }

  /**
   * Employment History
   */
  if (draft.experience && draft.experience.length > 0) {
    formattedText += `   WORK EXPERIENCE:\n `;
    draft.generatedExperience.forEach((history) => {
      formattedText += `  Company name: ${history.place}, Job title: ${
        history.title
      }, Period of employment: ${
        history.period
      }, description: ${history.generatedDescription.join("\n")}\n`;
    });
  }

  /**
   * Skills
   */
  if (draft.skills && draft.skills.length > 0) {
    formattedText += `  SKILLS:\n`;
    draft.generatedSkills.forEach((skill) => {
      formattedText += `${skill.name}, `;
    });
  }

  return stripHtmlTags(formattedText);
};

type DownloadPdfProps = {
  a4Ref: RefObject<HTMLDivElement>;
  draft: GeneratedDraft;
};

export const downloadPdf = async (props: DownloadPdfProps) => {
  const { a4Ref, draft } = props;

  if (!a4Ref.current) return;

  toast.info("Generating PDF...");

  const a4 = a4Ref.current;
  const pageCount = Math.ceil(a4.clientHeight / A4_HEIGHT);
  const pdf = new jsPDF({
    format: "a4",
    orientation: "portrait",
    unit: "px",
  });

  const width = pdf.internal.pageSize.getWidth();
  const height = pdf.internal.pageSize.getHeight();

  const cvText = getStructuredCvText(draft);
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

  pdf.save(`${draft.name}. CV for ${draft.vacancy.companyName}.pdf`);
};
