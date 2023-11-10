import Image from "next/image";
import { Menu, MenuButton, MenuItem } from "@szhsin/react-menu";
import { Tooltip } from "react-tooltip";

import { useDraftContext } from "../draft/DraftContext";

const src = "/add.png";

export const Add = () => {
  const { design, addComponent } = useDraftContext();

  return (
    <Menu
      menuButton={
        <MenuButton
          className="navigation common transform p-1 transition hover:-translate-y-1 motion-reduce:transition-none"
          data-tooltip-id={src}
        >
          <Image
            src={src}
            height={50}
            width={50}
            alt="add"
            className="rounded-lg"
          />
          <Tooltip id={src} place="bottom" content="Add item" />
        </MenuButton>
      }
      direction="right"
    >
      {Object.keys(design.components).map((componentType) => (
        <MenuItem
          key={componentType}
          onClick={() => {
            // @ts-ignore
            // eslint-disable-next-line
            // Wtf is this? todo
            addComponent({ type: componentType });
          }}
        >
          {componentType}
        </MenuItem>
      ))}
    </Menu>
  );
};
