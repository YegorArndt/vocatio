import { BiCopy } from "react-icons/bi";
import { CiFileOn } from "react-icons/ci";
import { PiFilePdf } from "react-icons/pi";
import { SiMicrosoftword } from "react-icons/si";
import { toast } from "sonner";
import { type Vacancy } from "@prisma/client";

import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
} from "~/components/external/MenuBar";
import { BlurImage } from "~/components";
import { Gpt } from "~/icons";
import { hfFormat, applyGpt } from "~/server/api/utils/ai";
import { RouterOutputs } from "~/utils/api";
import { COVER_LETTER_FIELD } from "./constants";

type TextEditorToolbarProps = {
  vacancy: Vacancy;
  user: RouterOutputs["users"]["get"];
  methods: {
    onCopy: () => void;
    onDownloadPdf: () => void;
    onGenerate: (generatedCoverLetter: string) => void;
  };
};

const getPrompt = (props: Record<string, string>) => {
  const { vacancyDescription, employmentHistory, professionalSummary, name } =
    props;
  return `Write a cover letter for the following vacancy posting: ${vacancyDescription}. 
        My employment history: ${employmentHistory}. 
        My professional summary: ${professionalSummary}. 
        My name is ${name}.
        Format: ${hfFormat}. Use professional tone. Use the common structure of a cover letter Make it sound more like a human, not AI.
    `;
};

export const TextEditorToolbar = (props: TextEditorToolbarProps) => {
  const { vacancy, user, methods } = props;

  const { onCopy, onGenerate, onDownloadPdf } = methods;

  const generateCoverLetter = async (model: string) => {
    toast.loading(`Generating cover letter with ${model}`, {
      id: COVER_LETTER_FIELD,
      duration: Infinity,
    });

    const generatedCoverLetter = await applyGpt([
      {
        role: "system",
        content: getPrompt({
          vacancyDescription: vacancy.description!,
          employmentHistory: user.employmentHistory
            .map((x) => x.description)
            .join(" "),
          professionalSummary: user.professionalSummary!,
          name: user.name,
        }),
      },
    ]);

    toast.dismiss(COVER_LETTER_FIELD);

    if (!generatedCoverLetter) {
      toast.error("Failed to generate cover letter", {
        duration: 5000,
      });
      return;
    }

    toast.success("Cover letter generated", {
      duration: 5000,
    });

    onGenerate(generatedCoverLetter);
  };

  return (
    <header className="sticky top-0 z-10 mx-5">
      <Menubar className="clr-card bg-card">
        {[
          {
            trigger: {
              label: "File",
              icon: <CiFileOn />,
            },
            actions: [
              {
                label: "Copy as text",
                icon: <BiCopy />,
                onClick: onCopy,
              },
              {
                label: "Download .pdf",
                icon: <PiFilePdf />,
                onClick: onDownloadPdf,
              },
              {
                label: "Download .docx",
                icon: <SiMicrosoftword />,
              },
            ],
          },
          {
            trigger: {
              label: "Generate cover letter",
              icon: <Gpt />,
            },
            actions: [
              {
                label: "gpt-4",
                icon: <BlurImage src="/ai/gpt-4.png" />,
                onClick: () => generateCoverLetter("gpt-4"),
              },
              {
                label: "gpt-3.5-turbo-1106",
                icon: <BlurImage src="/ai/gpt-3.png" />,
              },
              {
                label: "mistralai/Mistral-7B-Instruct-v0.2",
                icon: <BlurImage src="/ai/mistral.png" />,
              },
            ],
          },
        ].map(({ trigger, actions }) => (
          <MenubarMenu key={trigger.label}>
            <MenubarTrigger className="flex-y cursor-pointer gap-2">
              {trigger.icon}
              {trigger.label}
            </MenubarTrigger>
            <MenubarContent className="bg-primary">
              {actions.map(({ label, icon, onClick }, index) => (
                <MenubarItem
                  key={label}
                  className="flex-y cursor-pointer gap-2 hover:bg-hover"
                  disabled={!Boolean(onClick)}
                  onClick={onClick}
                >
                  {icon}
                  {label}
                </MenubarItem>
              ))}
            </MenubarContent>
          </MenubarMenu>
        ))}
      </Menubar>
    </header>
  );
};
