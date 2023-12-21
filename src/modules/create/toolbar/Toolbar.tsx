import { BlurImage } from "~/components/BlurImage";
import { Button } from "~/components/ui/buttons/Button";
import { downloadPdf } from "../utils";
import { useDraftContext } from "../../draft/DraftContext";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";

import { Divider } from "~/components/layout/Divider";
import { api } from "~/utils";
import {
  FocusableItem,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
} from "@szhsin/react-menu";
import { RiFontSansSerif } from "react-icons/ri";
import { useState } from "react";
import { BsArrowsCollapse } from "react-icons/bs";
import { FaTextHeight } from "react-icons/fa";
import { Chip } from "~/components";
import { FaClockRotateLeft } from "react-icons/fa6";
import { SlMagnifier } from "react-icons/sl";

const { log } = console;

type ToolbarProps = {
  openModal: () => void;
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

export const Toolbar = (props: ToolbarProps) => {
  const { openModal } = props;
  const { user, vacancy, a4Ref, design, updateDesign } = useDraftContext();
  const { mutate } = api.cvs.create.useMutation();
  const [filter, setFilter] = useState("");

  const saveAsDraft = () => mutate(design);

  return (
    <>
      <Button
        text="Review changes"
        frontIcon={<SlMagnifier />}
        className="common hover flex-y gap-1"
        onClick={openModal}
      />
      <Button
        text="Download PDF"
        frontIcon={
          <BlurImage
            src="/download-cloud.png"
            alt="Download"
            height={15}
            width={15}
          />
        }
        onClick={() => void downloadPdf(a4Ref, user.name, vacancy.companyName)}
        className="common hover flex-y gap-1"
      />
      <Menu
        menuButton={
          <MenuButton className="common hover flex-y gap-3">
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
            <MenuItem
              key={font}
              onClick={() =>
                updateDesign({ font: font === "Inter" ? "inherit" : font })
              }
            >
              {font}
            </MenuItem>
          ))}
      </Menu>
      <Button
        text="Undo"
        frontIcon={<FaClockRotateLeft />}
        endIcon={<Chip text="Soon" className="bg-sky px-1" />}
        className="common hover flex-y gap-1"
        disabled
      />
      <Button
        frontIcon={<BsArrowsCollapse />}
        endIcon={<Chip text="Soon" className="bg-sky px-1" />}
        text="Condense spacing"
        className="common hover flex-y gap-1"
        disabled
      />
      <Button
        frontIcon={<FaTextHeight />}
        text="Condense text"
        endIcon={<Chip text="Soon" className="bg-sky px-1" />}
        className="common hover flex-y gap-1"
        disabled
      />
      <Divider />
      <Button
        frontIcon={<IoIosCheckmarkCircleOutline />}
        text="Save as draft"
        className="common hover flex-y gap-1"
        onClick={saveAsDraft}
      />
    </>
  );
};
