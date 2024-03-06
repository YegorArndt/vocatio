import Head from "next/head";
import { RiDeleteBin6Line } from "react-icons/ri";
import { Button } from "~/components/ui/buttons/Button";
import { Badge } from "~/components/ui/external/Badge";
import {
  ResizablePanelGroup,
  ResizableHandle,
  ResizablePanel,
} from "~/components/ui/external/Resizable";
import { useA4 } from "~/hooks/useA4";
import { useCvContext } from "~/hooks/useCvContext";
import { CompanyPresentator } from "~/modules/create/CompanyPresentator";
import { DesignViewer } from "~/modules/create/DesignViewer";
import { FileName } from "~/modules/create/FileName";
import { PageBreak } from "~/modules/create/PageBreak";
import { DndProvider } from "~/modules/create/design/base-components/dnd/DndProvider";
import { A4_HEIGHT, A4_WIDTH } from "~/modules/create/design/constants";
import { DesignContext } from "~/modules/create/design/contexts/DesignContext";
import { LeftPanel } from "~/modules/create/left-panel/LeftPanel";
import { getFont } from "~/modules/utils";
import { cn } from "~/utils";

const { log } = console;

const CvEditorPage = () => {
  const { a4Ref, pages, setPages } = useA4();
  const cvContext = useCvContext();

  return (
    <>
      <Head>
        <title>
          {cvContext?.vacancy?.companyName
            ? `CV for ${cvContext.vacancy.companyName}`
            : "Generating CV..."}
        </title>
        <meta name="description" content="Create your CV" />
        <meta name="keywords" content="CV, Resume, Job, Vacancy" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <DesignContext a4Ref={a4Ref}>
        {(context) => (
          <ResizablePanelGroup direction="horizontal">
            {/* Main Nav */}
            <ResizablePanel defaultSize={10}>
              <LeftPanel />
            </ResizablePanel>

            {/* A4  */}
            <section className="pb-16">
              <FileName />
              <div
                ref={a4Ref}
                className={cn(
                  "a4",
                  context.design.a4ClassName,
                  getFont(context.design.font)
                )}
                style={{
                  height: A4_HEIGHT * pages,
                  width: A4_WIDTH,
                }}
              >
                <DndProvider
                  ref={context.imperative}
                  sections={context.design.sections}
                />
              </div>

              {pages > 1 && (
                <div className="flex-center">
                  <Button
                    data-html2canvas-ignore
                    frontIcon={<RiDeleteBin6Line />}
                    text={`Delete ${pages} page`}
                    onClick={() => setPages((prev) => prev - 1)}
                    className="outlined sm mt-6"
                  />
                </div>
              )}
            </section>

            {/* Design Viewer */}
            <ResizableHandle className="z-layout mx-[50px] !cursor-col-resize hover:bg-weiss">
              <div className="flex-evenly h-full flex-col">
                {Array.from({ length: pages }).map((_, i) => (
                  <Badge key={i}>Resize</Badge>
                ))}
              </div>
            </ResizableHandle>

            <ResizablePanel defaultSize={10} className="z-layout mr-3">
              <header className="flex-y h-20 justify-end gap-3">
                Applying for
                <CompanyPresentator />
              </header>
              <DesignViewer />
            </ResizablePanel>
          </ResizablePanelGroup>
        )}
      </DesignContext>

      {Array.from({ length: pages - 1 }).map((_, i) => (
        <PageBreak
          key={i}
          style={{
            top: 64 + A4_HEIGHT * (i + 1),
          }}
        />
      ))}
    </>
  );
};

export default CvEditorPage;
