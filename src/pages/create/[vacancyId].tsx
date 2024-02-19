import Head from "next/head";
import { Rubik } from "next/font/google";
import { useState, useRef, useEffect } from "react";
import cn from "classnames";

import { DndProvider } from "~/modules/create/design/base-components/dnd/DndProvider";
import { PageBreak } from "~/modules/create/PageBreak";
import { DesignContext } from "~/modules/create/design/contexts/DesignContext";
import { useGeneratedData } from "~/hooks/useGeneratedData";
import { A4_HEIGHT, A4_WIDTH } from "~/modules/create/design/constants";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "~/components/ui/external/Resizable";
import { Button } from "~/components/ui/buttons/Button";
import { RiDeleteBin6Line } from "react-icons/ri";
import { Badge } from "~/components/ui/external/Badge";
import { LeftPanel } from "~/modules/create/left-panel/LeftPanel";
import { DesignViewer } from "~/modules/create/DesignViewer";

const { log } = console;

const rubik = Rubik({ subsets: ["latin"] });

const CvEditor = () => {
  const { generated } = useGeneratedData();
  const { a4Ref, pages, setPages } = useA4();

  return (
    <>
      <Head>
        <title>
          {generated?.vacancy?.companyName
            ? `CV for ${generated?.vacancy.companyName}`
            : "Generating CV..."}
        </title>
        <meta
          name="description"
          content="Free AI CV builder. Generate CVs tailored to the job you want."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {generated && (
        // @ts-ignore
        <DesignContext a4Ref={a4Ref}>
          {(context) => (
            <ResizablePanelGroup direction="horizontal">
              {/* Main Nav */}
              <ResizablePanel defaultSize={10}>
                <LeftPanel />
              </ResizablePanel>

              {/* A4  */}
              <div className="my-16">
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
              </div>

              {/* Design Viewer */}
              <ResizableHandle className="z-layout mx-[50px]">
                <div className="flex-evenly h-full flex-col">
                  {Array.from({ length: pages }).map((_, i) => (
                    <Badge key={i}>Resize</Badge>
                  ))}
                </div>
              </ResizableHandle>
              <ResizablePanel defaultSize={10} className="z-layout mr-3 pt-16">
                <DesignViewer />
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
    // Function to calculate and set pages
    const calculatePages = () => {
      if (a4Ref.current) {
        const pageCount = Math.ceil(a4Ref.current.scrollHeight / A4_HEIGHT);
        setPages(pageCount);
      }
    };

    let observer: MutationObserver;

    // Delay setup of MutationObserver by 5 seconds
    const timer = setTimeout(() => {
      if (a4Ref.current) {
        observer = new MutationObserver(calculatePages);

        observer.observe(a4Ref.current, { childList: true, subtree: true });

        // Initial calculation
        calculatePages();
      }
    }, 5000);

    // Cleanup function
    return () => {
      clearTimeout(timer);
      if (observer) {
        observer.disconnect();
      }
    };
  }, []); // Empty dependencies array ensures this runs once after initial render

  return { a4Ref, pages, setPages };
};
