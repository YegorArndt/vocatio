import { useRef } from "react";
import { toast } from "sonner";
import jsPDF from "jspdf";

import { type RouterOutputs } from "~/utils/api";
import { useFormContext } from "react-hook-form";
import { TextEditorToolbar } from "./TextEditorToolbar";
import { PartialVacancy } from "~/modules/types";

type TextEditorProps = {
  vacancy: PartialVacancy;
  user: RouterOutputs["users"]["get"];
};

const saveTextAsPdf = (text: string, fileName = "document") => {
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  pdf.setFontSize(12);

  const lineHeight = 10;
  const margin = 20;
  const maxWidth = pdf.internal.pageSize.getWidth() - 2 * margin;
  const maxHeight = pdf.internal.pageSize.getHeight() - 2 * margin;

  // Split the text into lines
  const lines = pdf.splitTextToSize(text, maxWidth);

  let y = margin;

  for (const line of lines) {
    if (y > maxHeight) {
      pdf.addPage();
      y = margin;
    }

    pdf.text(line, margin, y);
    y += lineHeight;
  }

  pdf.save(`${fileName}.pdf`);
};

export const TextEditor = (props: TextEditorProps) => {
  const { vacancy, user } = props;
  const editableRef = useRef<null | HTMLDivElement>(null);

  const { watch } = useFormContext();

  const methods = {
    onCopy: () => {
      const value = editableRef.current?.innerText;
      const message = value ? "Copied to clipboard" : "Nothing to copy";
      toast.info(message);
      if (value) void navigator.clipboard.writeText(value);
    },
    onDownloadPdf: () => {
      const value = editableRef.current?.innerText;
      const message = value ? "Downloaded as PDF" : "Nothing to download";
      toast.info(message);

      if (!value) return;

      saveTextAsPdf(value, watch("file-name"));
    },
    onGenerate: (generatedCoverLetter: string) => {
      if (!editableRef.current) return;

      /**
       * Toast handled in TextEditorToolbar.tsx
       */
      editableRef.current.innerText = generatedCoverLetter;
    },
  };

  return (
    <section className="flex grow flex-col gap-11 overflow-auto pb-[5rem]">
      <TextEditorToolbar vacancy={vacancy} user={user} methods={methods} />
      <div
        ref={editableRef}
        contentEditable
        suppressContentEditableWarning
        data-placeholder={`Dear hiring team at ${vacancy.companyName},`}
        className="mx-auto w-[793px] whitespace-pre-wrap rounded-md bg-white p-5 clr-black"
      />
    </section>
  );
};
