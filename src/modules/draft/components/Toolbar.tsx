import type { User, Vacancy } from "@prisma/client";
import { type RefObject, useState, useEffect } from "react";
import { BsArrowsCollapse } from "react-icons/bs";
import { FaTextHeight } from "react-icons/fa";
import { RiFontSansSerif } from "react-icons/ri";
import { FaClockRotateLeft } from "react-icons/fa6";
import { SlMagnifier } from "react-icons/sl";
import { jsPDF } from "jspdf";
import { snakeCase } from "lodash-es";
import html2canvas from "html2canvas";

import { api } from "~/utils";
import { useDraftContext } from "../DraftContext";
import { BlurImage } from "~/components/BlurImage";
import { Button } from "~/components/ui/buttons/Button";
import { FocusableItem, MenuButton, MenuDivider } from "@szhsin/react-menu";
import {
  TooltipTrigger,
  TooltipContent,
  Tooltip,
  TooltipProvider,
} from "~/components/external/Tooltip";
import { Spinner } from "~/components";
import { CustomMenu } from "~/components/external/CustomMenu";
import { CustomMenuItem } from "~/components/external/CustomMenuItem";
import {
  Drawer,
  DrawerContent,
  DrawerHandle,
  DrawerTrigger,
} from "~/components/external/Drawer";
import { Diff } from "./Diff";
import { Blur } from "~/components/Blur";
import { CoverLetterDrawer } from "./cover-letter/CoverLetterDrawer";
import { A4_HEIGHT, A4_WIDTH } from "../constants";
import { toast } from "sonner";

const { log } = console;

const downloadPdf = async (
  a4Ref: RefObject<HTMLDivElement>,
  userName: User["name"],
  companyName: Vacancy["companyName"] = "cv"
) => {
  const a4 = a4Ref.current;
  if (!a4) return;

  const pageCount = Math.ceil(a4.clientHeight / A4_HEIGHT);

  const pdf = new jsPDF({
    format: "a4",
    orientation: "portrait",
    unit: "px",
  });

  const width = pdf.internal.pageSize.getWidth();
  const height = pdf.internal.pageSize.getHeight();

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

    if (i > 0) {
      pdf.addPage();
    }

    pdf.addImage(imgData, "PNG", 0, 0, width, height, undefined, "FAST");
  }

  pdf.save(`${snakeCase(userName)}_${companyName}.pdf`);
};

const MoveToAppliedButton = (props: { vacancyId: string }) => {
  const { vacancyId } = props;
  const [timer, setTimer] = useState(10);

  const { mutate: updateVacancy, isLoading } =
    api.vacancies.upsert.useMutation();

  useEffect(() => {
    let interval: NodeJS.Timeout;

    interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer === 1) {
          toast.dismiss("move-to-applied");
          return prevTimer;
        }

        return prevTimer - 1;
      });
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [timer]);

  const moveToApplied = (shouldMove: boolean) => {
    toast.dismiss("move-to-applied");
    if (!shouldMove) return;

    void updateVacancy({
      id: vacancyId,
      group: "applied",
    });
    toast.success("Moved to ✅ applied");
  };

  return (
    <div className="flex-between w-full gap-2">
      <span className="flex-y gap-3">
        <span>{timer}</span>Move vacancy to applied?
      </span>
      <div className="flex-y gap-2">
        {["Yes", "No"].map((text, index) => (
          <Button
            key={text}
            text={text}
            onClick={() => moveToApplied(index === 0)}
            baseCn="!cursor-pointer clr-white sm rounded-md"
            className={index === 0 ? "bg-green" : "bg-red"}
            disabled={isLoading}
          />
        ))}
      </div>
    </div>
  );
};

const fonts = [
  "Arial",
  "Arial Black",
  "Arial Narrow",
  "Arial Rounded MT Bold",
  "Calibri",
  "Century Gothic",
  "Franklin Gothic Medium",
  "Futura",
  "Geneva",
  "Gill Sans",
  "Helvetica",
  "Impact",
  "Lucida Grande",
  "Optima",
  "Segoe UI",
  "Tahoma",
  "Trebuchet MS",
  "Verdana",
  "Inter",
];

export const Toolbar = () => {
  const { data: user, isLoading: userLoading } = api.users.get.useQuery();

  const { draft, a4Ref, design, updateDesign } = useDraftContext();

  const { data: vacancy, isLoading: vacancyLoading } =
    api.vacancies.getById.useQuery({ id: draft.vacancyId });

  const [filter, setFilter] = useState("");

  return (
    <>
      <Drawer>
        <DrawerTrigger
          className="common hover flex-y gap-3"
          disabled={userLoading || vacancyLoading}
        >
          {userLoading || vacancyLoading ? (
            <Spinner size={10} />
          ) : (
            <Blur element={<SlMagnifier />} />
          )}
          Review changes
        </DrawerTrigger>
        <DrawerContent className="max-h-[90vh] bg-primary py-5 pl-5">
          <DrawerHandle />
          {user && vacancy && <Diff user={user} vacancy={vacancy} />}
        </DrawerContent>
      </Drawer>
      <CoverLetterDrawer />
      <Button
        text="Download PDF"
        frontIcon={
          vacancyLoading ? (
            <Spinner size={10} />
          ) : (
            <BlurImage
              src="/download-cloud.png"
              alt="Download"
              height={15}
              width={15}
            />
          )
        }
        onClick={() => {
          void downloadPdf(a4Ref, user!.name, vacancy!.companyName);
          toast.success(<MoveToAppliedButton vacancyId={vacancy!.id} />, {
            id: "move-to-applied",
            duration: 10000,
          });
        }}
        className="common hover flex-y gap-1"
        disabled={vacancyLoading}
      />
      <CustomMenu
        menuButton={
          <MenuButton className="common hover flex-y  gap-3">
            <RiFontSansSerif /> {design.font}
          </MenuButton>
        }
        direction="right"
        transition
      >
        <FocusableItem>
          {({ ref }) => (
            <input
              ref={ref}
              type="text"
              placeholder="Search fonts"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-transparent p-2 outline-none"
            />
          )}
        </FocusableItem>
        <MenuDivider />
        {fonts
          .filter((font) => font.toLowerCase().includes(filter.toLowerCase()))
          .map((font) => (
            <CustomMenuItem
              key={font}
              onClick={() =>
                updateDesign({ font: font === "Inter" ? "inherit" : font })
              }
            >
              {font}
            </CustomMenuItem>
          ))}
      </CustomMenu>
      {[
        { text: "Undo", icon: <FaClockRotateLeft /> },
        { text: "Condense spacing", icon: <BsArrowsCollapse /> },
        { text: "Condense text", icon: <FaTextHeight /> },
      ].map(({ text, icon }) => (
        <TooltipProvider key={text}>
          <Tooltip>
            <TooltipTrigger
              className="common hover flex-y gap-3 whitespace-nowrap"
              disabled
            >
              {icon} {text}
            </TooltipTrigger>
            <TooltipContent>✨ Coming soon</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </>
  );
};
