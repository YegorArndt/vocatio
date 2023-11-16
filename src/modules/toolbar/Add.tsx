import Image from "next/image";
import { Menu, MenuButton, MenuItem } from "@szhsin/react-menu";
import { Tooltip } from "react-tooltip";

import { useDraftContext } from "../draft/DraftContext";
import { TypeOfComponent } from "../draft/types";

const src = "/add.png";

export const Add = () => {
  const {
    design,
    addComponent,
    draftState: { DOWNLOAD_FIRED },
  } = useDraftContext();

  return (
    <Menu
      menuButton={
        <MenuButton
          className="navigation common transform p-1 transition hover:-translate-y-1 motion-reduce:transition-none"
          data-tooltip-id={src}
          disabled={DOWNLOAD_FIRED}
        >
          <Image
            src={src}
            height={50}
            width={50}
            alt="add"
            className="rounded-lg"
          />
          <Tooltip id={src} place="top" content="Add item" />
        </MenuButton>
      }
      direction="right"
    >
      {Object.keys(design.components).map((componentType) => (
        <MenuItem
          key={componentType}
          onClick={() => {
            addComponent({ type: componentType as TypeOfComponent });
          }}
        >
          {componentType}
        </MenuItem>
      ))}
    </Menu>
  );
};
