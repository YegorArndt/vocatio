import { type Vacancy } from "@prisma/client";

import { type RouterOutputs } from "~/utils/api";
import { TextEditorToolbar } from "./TextEditorToolbar";
import { useRef } from "react";
import { toast } from "sonner";

type TextEditorProps = {
  vacancy: Vacancy;
  user: RouterOutputs["users"]["get"];
};

export const TextEditor = (props: TextEditorProps) => {
  const { vacancy, user } = props;
  const editableRef = useRef<null | HTMLDivElement>(null);

  const methods = {
    onCopy: () => {
      const value = editableRef.current?.innerText;
      const message = value ? "Copied to clipboard" : "Nothing to copy";
      toast.info(message);
      if (value) navigator.clipboard.writeText(value);
    },
    onGenerate: (generatedCoverLetter: string) => {
      /**
       * Toast handled in TextEditorToolbar.tsx
       */
      editableRef.current!.innerText = generatedCoverLetter;
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
        className="mx-auto  w-[793px] whitespace-pre-wrap rounded-md bg-white p-5 clr-black"
      />
    </section>
  );
};
