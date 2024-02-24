import Head from "next/head";
import cn from "classnames";
import { RiDeleteBin6Line } from "react-icons/ri";

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
import { Badge } from "~/components/ui/external/Badge";
import { LeftPanel } from "~/modules/create/left-panel/LeftPanel";
import { DesignViewer } from "~/modules/create/DesignViewer";
import { getFont } from "~/modules/utils";
import { useA4 } from "~/hooks/useA4";
import { BlurImage } from "~/components";
import { FileName } from "~/modules/create/FileName";

const { log } = console;

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
        <DesignContext a4Ref={a4Ref}>
          {(context) => (
            <ResizablePanelGroup direction="horizontal">
              {/* Main Nav */}
              <ResizablePanel defaultSize={10}>
                <LeftPanel />
              </ResizablePanel>

              {/* A4  */}
              <section>
                <FileName />
                <div
                  ref={a4Ref}
                  className={cn(
                    "a4 main-center",
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
              <ResizableHandle className="z-layout mx-[50px] hover:bg-weiss">
                <div className="flex-evenly h-full flex-col">
                  {Array.from({ length: pages }).map((_, i) => (
                    <Badge key={i}>Resize</Badge>
                  ))}
                </div>
              </ResizableHandle>

              <ResizablePanel defaultSize={10} className="z-layout mr-3">
                <header className="flex-y h-20 justify-end gap-3">
                  Applying for
                  <BlurImage src={generated?.vacancy.image} rounded />
                  {generated?.vacancy.companyName}
                </header>
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
