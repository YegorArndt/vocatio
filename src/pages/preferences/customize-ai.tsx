import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
} from "~/components/ui/external/MenuBar";
import Head from "next/head";
import { Fragment } from "react";
import ScrollToTop from "react-scroll-to-top";
import { Layout } from "~/components/layout/Layout";
import { usePersistentData } from "~/hooks/usePersistentData";
import { preferencesToolbar } from "~/modules/preferences/my-info/constants";
import { BlurImage } from "~/components";
import { Badge } from "~/components/ui/external/Badge";
import { typedEntries } from "~/__archieved/draft/utils/common";
import { toast } from "sonner";
import { Checkmark } from "~/components/icons";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "~/components/ui/external/Accordion";
import { IoArrowRedoSharp } from "react-icons/io5";
import { Switch } from "~/components/ui/external/Switch";
import { BestPracticesDrawer } from "~/modules/preferences/customize-ai/BestPracticesDrawer";
import {
  TooltipTrigger,
  TooltipContent,
  Tooltip,
  TooltipProvider,
} from "~/components/ui/external/Tooltip";
import { Models } from "~/modules/init-gen/types";

const { log } = console;

const models: Record<
  Models,
  {
    icon: JSX.Element;
    badge: string;
  }
> = {
  "gpt-4": {
    icon: <BlurImage src="/ai/gpt-4.png" className="rounded-full" />,
    badge: "most capable",
  },
  "gpt-3.5": {
    icon: <BlurImage src="/ai/gpt-3.png" className="rounded-full" />,
    badge: "default",
  },
  mixtral: {
    icon: <BlurImage src="/ai/mistral.png" />,
    badge: "fastest",
  },
};

const CustomizeAiPage = () => {
  const { ls, updateLs } = usePersistentData();

  return (
    <Fragment>
      <Head>
        <title>Customize AI - Vocatio</title>
        <meta
          name="description"
          content="Free AI based CV builder. Generate CVs tailored to the job description."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout toolbar={preferencesToolbar}>
        <div className="breakout">
          <h1>Customize AI.</h1>
          <p>
            Define what it can and cannot do. You can also set the default
            model.
          </p>
          <section className="flex-between max-w-[800px] rounded-md border p-5">
            <h6 className="flex flex-col gap-1 text-lg">
              Default model
              <small className="text-sm clr-disabled">
                Find out which AI works best for you
              </small>
            </h6>
            <Menubar className="clr-card bg-card">
              <MenubarMenu>
                <MenubarTrigger className="flex-y cursor-pointer gap-2">
                  {models[ls.defaultModel].icon}
                  {ls.defaultModel}
                </MenubarTrigger>
                <MenubarContent className="bg-primary">
                  {typedEntries(models).map(([key, value]) =>
                    key === "gpt-4" ? (
                      <TooltipProvider key={key}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <MenubarItem
                              onClick={() => {
                                toast.info("Upgrade to premium to use gpt-4");
                              }}
                              className="flex-y cursor-pointer gap-2 hover:bg-hover"
                            >
                              {value.icon}
                              {key}
                              <Badge variant="outline">{value.badge}</Badge>
                              <BlurImage src="/premium.png" />
                            </MenubarItem>
                          </TooltipTrigger>
                          <TooltipContent>Premium feature</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      <MenubarItem
                        key={key}
                        className="flex-y cursor-pointer gap-2 hover:bg-hover"
                        onClick={() => {
                          updateLs({ defaultModel: key });
                          toast.success(`Default model set to ${key}`);
                        }}
                      >
                        {value.icon}
                        {key}
                        <Badge variant="outline">{value.badge}</Badge>
                      </MenubarItem>
                    )
                  )}
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
          </section>
          <section className="mt-11 flex max-w-[800px] flex-col gap-3 rounded-md border p-5">
            <h6 className="text-lg">
              Best practices for experience section (opinionated)
            </h6>
            <p>
              Your accomplishments need to be translated into the common
              language everyone understands. The AI automatically follows these
              best practices to compose your experience section.
            </p>
            <div className="flex flex-col gap-2">
              {["Concise", "Skills first"].map((practice) => (
                <div key={practice} className="flex-y my-3 gap-2 text-sm">
                  <Checkmark />
                  {practice}
                </div>
              ))}
              {[
                {
                  practice: "Stressing impact",
                  from: "significantly reduced costs",
                  to: "reduced costs by 50% from $100,000 to $50,000",
                },
                {
                  practice: "Exaggeration",
                  from: "developed a blog website",
                  to: "developed a blog website, attracting over 50,000 monthly visits, boosting the company's online presence.",
                },
              ].map(({ practice, from, to }, i) => (
                <Accordion key={practice} type="single" collapsible>
                  <AccordionItem value="i">
                    <header className="flex-y gap-2">
                      <AccordionTrigger
                        className="flex-y gap-2 text-sm"
                        arrowSize={10}
                      >
                        <Checkmark /> {practice}
                      </AccordionTrigger>
                    </header>
                    <AccordionContent className="grid grid-cols-2 items-center rounded-md bg-card !p-3">
                      <div className="flex-between">
                        {from}
                        <IoArrowRedoSharp />
                      </div>
                      <div className="px-5">{to}</div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ))}
            </div>
            <div className="flex py-5">
              <BestPracticesDrawer />
            </div>
            <h6 className="text-lg">
              Disable <Badge>Available from Vocatio v0.2</Badge>
            </h6>
            <p>
              You can disable these adjustments per employment history here.
            </p>
            <div className="mt-5 flex flex-col gap-5">
              {ls.user?.experience?.map((entry) => (
                <div key={entry.id} className="grid grid-cols-2 gap-5">
                  <div className="flex-y gap-5">
                    <BlurImage src={entry.image} height={40} width={40} />
                    <h6 className="text-md"> {entry.place}</h6>
                  </div>
                  <Switch />
                </div>
              ))}
            </div>
          </section>
        </div>
      </Layout>
      <ScrollToTop smooth color="black" className="flex-center" />
    </Fragment>
  );
};

export default CustomizeAiPage;
