import Head from "next/head";
import { Rubik } from "next/font/google";
import { useState, useRef, useEffect } from "react";
import cn from "classnames";

import { DndProvider } from "~/modules/create/design/baseComponents/DndProvider";
import { PageBreak } from "~/modules/create/PageBreak";
import { DesignContext } from "~/modules/create/design/contexts/DesignContext";
import { useCurrentDraft } from "~/hooks/useCurrentDraft";
import { A4_HEIGHT, A4_WIDTH } from "~/modules/create/design/constants";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "~/components/ui/external/Resizable";
import { mainNav } from "~/components/layout/constants";
import { NavigationLink } from "~/components";
import { DiffDrawer } from "~/modules/create/DiffDrawer";
import { BiDownload } from "react-icons/bi";
import { usePersistentData } from "~/hooks/usePersistentData";
import { Button } from "~/components/ui/buttons/Button";
import { downloadPdf } from "~/modules/create/toolbar/utils";
import { RiDeleteBin6Line } from "react-icons/ri";
import { Link } from "~/components/ui/buttons/Link";
import { LinkedinColor } from "~/icons";
import { RightPanel } from "~/modules/create/right-panel/RightPanel";
import { Badge } from "~/components/ui/external/Badge";

const { log } = console;

const rubik = Rubik({ subsets: ["latin"] });

const CvEditor = () => {
  const { currentDraft } = useCurrentDraft();
  const { ls } = usePersistentData();
  const { a4Ref, pages, setPages } = useA4();
  // useWarnOnUnload();

  return (
    <>
      <Head>
        <title>
          {currentDraft?.vacancy?.companyName
            ? `CV for ${currentDraft?.vacancy.companyName}`
            : "Generating CV..."}
        </title>
        <meta
          name="description"
          content="Free AI CV builder. Generate CVs tailored to the job you want."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {currentDraft && (
        <DesignContext a4Ref={a4Ref}>
          {(context) => (
            <ResizablePanelGroup direction="horizontal">
              {/* Main Nav */}
              <ResizablePanel defaultSize={10}>
                <nav className="fixed ml-5 mt-16 flex flex-col gap-3">
                  {mainNav.map((link) => (
                    <NavigationLink
                      key={link.props.to}
                      {...link.props}
                      baseCn="nav-button"
                    />
                  ))}
                  <DiffDrawer />
                  <Button
                    frontIcon={<BiDownload />}
                    text="Download .pdf"
                    className="nav-button !gap-0"
                    onClick={() =>
                      void downloadPdf({ a4Ref, draft: currentDraft })
                    }
                  />
                  {currentDraft?.vacancy?.sourceUrl && (
                    <Link
                      frontIcon={<LinkedinColor />}
                      text="Back to job posting"
                      to={currentDraft.vacancy.sourceUrl}
                      className="nav-button"
                      newTab
                    />
                  )}
                </nav>
              </ResizablePanel>

              {/* A4  */}
              <div className="mb-16 pt-16">
                <div
                  ref={a4Ref}
                  className={cn(
                    "a4 main-center",
                    context.design.a4ClassName,
                    rubik.className
                  )}
                  style={{
                    height: A4_HEIGHT * pages,
                    width: A4_WIDTH,
                  }}
                >
                  <DndProvider sections={context.design.sections} />
                </div>

                {!!a4Ref.current && (
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
              </div>

              {/* Design Viewer */}
              <ResizableHandle className="z-layout mx-[50px]">
                <div className="flex-evenly h-full flex-col">
                  {Array.from({ length: pages * 2 }).map((_, i) => (
                    <Badge key={i}>Resize</Badge>
                  ))}
                </div>
              </ResizableHandle>
              <ResizablePanel defaultSize={10} className="z-layout mr-3 pt-16">
                <RightPanel />
              </ResizablePanel>
            </ResizablePanelGroup>
          )}
        </DesignContext>
      )}

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

export default CvEditor;

const useA4 = () => {
  const [pages, setPages] = useState(1);
  const a4Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const a4 = a4Ref.current;
    if (!a4) return;

    const observer = new MutationObserver(() => {
      const pageCount = Math.ceil(a4.scrollHeight / A4_HEIGHT);
      setPages(pageCount);
    });

    observer.observe(a4, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [a4Ref.current]);

  return { a4Ref, pages, setPages };
};

const useWarnOnUnload = () => {
  useEffect(() => {
    window.onbeforeunload = () => true;
    return () => {
      window.onbeforeunload = null;
    };
  }, []);
};
