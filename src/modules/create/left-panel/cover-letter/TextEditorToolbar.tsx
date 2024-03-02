import { BiCopy } from "react-icons/bi";
import { CiFileOn } from "react-icons/ci";
import { PiFilePdf } from "react-icons/pi";
import { SiMicrosoftword } from "react-icons/si";
import { toast } from "sonner";

import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
} from "~/components/ui/external/MenuBar";
import { BlurImage } from "~/components";
import {
  hfFormat,
  applyGpt,
  instruct,
  cleanAiOutput,
} from "~/server/api/utils/ai";
import { Badge } from "~/components/ui/external/Badge";

import {
  TooltipTrigger,
  TooltipContent,
  Tooltip,
  TooltipProvider,
} from "~/components/ui/external/Tooltip";
import { Gpt } from "~/components/icons";
import { PartialVacancy, RouterUser, Models } from "~/modules/types";
import { Cv, Gen } from "~/modules/init-gen/types";
import { api } from "~/utils";
import { CvContextManager } from "~/modules/CvContextManager";
import { stripHtmlTags } from "~/modules/utils";

const { log } = console;

type TextEditorToolbarProps = {
  vacancy: PartialVacancy;
  user: RouterUser;
  methods: {
    onCopy: () => void;
    onDownloadPdf: () => void;
    onGenerate: (generatedCoverLetter: string) => void;
  };
};

const getPrompt = (gen: Gen, cv: Cv, user: RouterUser) => {
  const { vacancy } = gen;
  const { userName, contact, experience, summary, languages } = cv;
  const prompt = `
  -   Write a cover letter for the following vacancy posting by company ${
    vacancy.companyName
  }: ${vacancy.description}.
   - Insert my data into the cover letter:
      My employment history: ${experience
        .map((x) => stripHtmlTags(`${x.bullets.map((x) => x.text).join("\n")}`))
        .join(", ")}.
      My professional summary: ${summary}.
      My name: ${userName}.
      My contact info: ${contact
        .map((x) => `${x.name}: ${x.value}`)
        .join(", ")}.
      My language skills (if needed): ${languages
        .map((x) => x.name)
        .join(", ")}.
      Date: ${new Date().toLocaleDateString()}.
      Email: ${user.email}.

   - Format of the cover letter: ${hfFormat}. Use professional tone. Use the common structure of a cover letter. Make it sound more like a human, not AI! Write the cover letter in the language in which the vacancy posting is written. We do not know any contact data on the receiver. So do not include "[Company Address]
   [City, State, Zip Code]".  
    `;

  log("Prompt: ", prompt);

  return prompt;
};

export const TextEditorToolbar = (props: TextEditorToolbarProps) => {
  const { methods } = props;
  const { onCopy, onGenerate, onDownloadPdf } = methods;
  const { data: user } = api.users.get.useQuery();

  const generateCoverLetter = async (model: Models) => {
    const instance = CvContextManager.getInstance();
    const cv = instance.getCv();
    const gen = instance.getGen();

    if (!cv || !gen || !user) return;

    let letter = cv.coverLetter;

    // Existing letter ?
    if (letter) {
      onGenerate(letter);
      return;
    }

    toast.loading(`Generating cover letter with ${model}`, {
      duration: Infinity,
    });

    const prompt = getPrompt(gen, cv, user);

    if (model === "gpt-3.5") {
      letter = await applyGpt(prompt, model);
    } else {
      const clByMixtral = await instruct(prompt, { max_new_tokens: 1000 });
      letter = cleanAiOutput(clByMixtral.generated_text, [prompt]);
    }

    toast.dismiss();

    if (!letter) {
      toast.error("Failed to generate cover letter", {
        duration: 5000,
      });
      return;
    }

    const coverLetter = cleanAiOutput(letter, [
      "[Company Address]",
      "[City, State, Zip Code]",
    ]);

    toast.success("Cover letter generated", {
      duration: 5000,
    });

    CvContextManager.getInstance().updateCv({ coverLetter });
    onGenerate(coverLetter);
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
                badge: null,
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
              label: "Generate cover letter with",
              icon: <Gpt />,
            },
            actions: [
              {
                label: "gpt-4",
                icon: (
                  <BlurImage src="/ai/gpt-4.png" className="rounded-full" />
                ),
                badge: "most cabable",
              },
              {
                label: "gpt-3.5",
                icon: (
                  <BlurImage src="/ai/gpt-3.png" className="rounded-full" />
                ),
                badge: "default",
                onClick: () => generateCoverLetter("gpt-3.5"),
              },
              {
                label: "mixtral",
                icon: <BlurImage src="/ai/mistral.png" />,
                badge: "fastest",
                onClick: () => generateCoverLetter("mixtral"),
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
              {actions.map(({ label, icon, onClick, badge }) =>
                label === "gpt-4" ? (
                  <TooltipProvider key={label}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <MenubarItem
                          onClick={() => {
                            toast.info("Upgrade to premium to use gpt-4");
                          }}
                          className="flex-y hover:main-hover cursor-pointer gap-2"
                        >
                          {icon}
                          {label}
                          {badge && <Badge variant="outline">{badge}</Badge>}
                          <BlurImage src="/premium.png" />
                        </MenubarItem>
                      </TooltipTrigger>
                      <TooltipContent>Premium feature</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : (
                  <MenubarItem
                    key={label}
                    className="flex-y hover:main-hover cursor-pointer gap-2"
                    disabled={!onClick}
                    onClick={onClick}
                  >
                    {icon}
                    {label}
                    {badge && <Badge variant="outline">{badge}</Badge>}
                  </MenubarItem>
                )
              )}
            </MenubarContent>
          </MenubarMenu>
        ))}
      </Menubar>
    </header>
  );
};
