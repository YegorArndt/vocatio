import { type DraggableAttributes } from "@dnd-kit/core";
import { type SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { type HTMLAttributes, type PropsWithChildren } from "react";
import { Tooltip } from "react-tooltip";
import { BiChevronDown, BiDotsHorizontalRounded, BiText } from "react-icons/bi";
import { ImBold } from "react-icons/im";
import { BsTypeItalic } from "react-icons/bs";
import {
  AiFillDelete,
  AiOutlineCopy,
  AiOutlineUnderline,
} from "react-icons/ai";
import { IoHandLeftSharp } from "react-icons/io5";
import { LuUngroup } from "react-icons/lu";
import cn from "classnames";
import { Menu, MenuButton, MenuItem, SubMenu } from "@szhsin/react-menu";

import { Button } from "~/components/ui/buttons/Button";
import {
  type Design,
  useDraftContext,
  DraftComponent,
} from "~/modules/draft/DraftContext";
import { updateCn, updateType } from "./utils";
import { FaHeading, FaUndo } from "react-icons/fa";

type EditorTooltipProps = PropsWithChildren<{
  component: DraftComponent;
  dndRef: (node: HTMLElement | null) => void;
  listeners: SyntheticListenerMap | undefined;
  attributes: DraggableAttributes;
}> &
  HTMLAttributes<HTMLDivElement>;

const quickActions = {
  bold: {
    content: <ImBold />,
    updateFn: (design: Design, componentId: string) =>
      updateCn(design, componentId, "font-bold"),
  },
  "border-bottom": {
    content: <AiOutlineUnderline />,
    updateFn: (design: Design, componentId: string) =>
      updateCn(design, componentId, "border-bottom"),
  },
  italic: {
    content: <BsTypeItalic />,
    updateFn: (design: Design, componentId: string) =>
      updateCn(design, componentId, "!italic"),
  },
};

const menuActions = [
  {
    label: "Delete",
    icon: <AiFillDelete />,
  },
  {
    label: "Duplicate",
    icon: <AiOutlineCopy />,
  },
];

const ColorCube = (props: { color: string }) => {
  const { color } = props;

  return (
    <div
      className="mr-2 h-[15px] w-[15px] rounded-sm border"
      style={{ backgroundColor: color }}
    />
  );
};

export const EditorTooltip = (props: EditorTooltipProps) => {
  const { component, dndRef, listeners, attributes, children, ...rest } = props;
  const { id } = component;
  const { updateDesign } = useDraftContext();

  return (
    <div ref={dndRef} data-tooltip-id={id} {...rest}>
      {children}
      <Tooltip
        id={id}
        place="top"
        opacity={1}
        style={{ paddingInline: 10, zIndex: 9999 }}
        globalCloseEvents={{ scroll: true, clickOutsideAnchor: true }}
        render={() => {
          return (
            <ul className="flex-center [&>li+li]:border-left w-full gap-3 rounded-md [&>li+li]:pl-3">
              <li>
                <Menu
                  menuButton={
                    <MenuButton className="navigation sm common gap-2">
                      Text Color
                      <BiChevronDown />
                    </MenuButton>
                  }
                >
                  {"black white blue".split(" ").map((color) => (
                    <MenuItem
                      key={color}
                      onClick={() => {
                        updateDesign((design) => {
                          return updateCn(
                            design,
                            id,
                            `clr-${color}`,
                            /clr-.*$/
                          );
                        });
                      }}
                    >
                      <ColorCube color={color} />
                      {color}
                    </MenuItem>
                  ))}
                </Menu>
              </li>
              <li {...listeners} {...attributes}>
                <Button className="navigation sm gap-2">
                  <IoHandLeftSharp /> Drag
                </Button>
              </li>
              {Object.entries(quickActions).map(
                ([key, { content, updateFn }]) => (
                  <li key={key}>
                    <Button
                      baseCn="navigation sm gap-2"
                      className={cn({
                        "!clr-secondary-hover scale-110 transform !bg-secondary-hover transition":
                          component.props.className?.includes(key),
                      })}
                      onClick={() => {
                        updateDesign((design) => updateFn(design, id));
                      }}
                    >
                      {content}
                    </Button>
                  </li>
                )
              )}
              <li>
                <Menu
                  menuButton={
                    <MenuButton className="navigation sm common gap-2">
                      <BiDotsHorizontalRounded />
                    </MenuButton>
                  }
                >
                  {menuActions.map(({ label, icon }) => (
                    <MenuItem key={label} className="flex items-center gap-2">
                      {icon}
                      {label}
                    </MenuItem>
                  ))}
                  <SubMenu
                    label={
                      <Button className="flex items-center gap-2" disabled>
                        <FaUndo />
                        Turn into
                      </Button>
                    }
                  >
                    {[
                      {
                        content: (
                          <>
                            <BiText />
                            Text
                          </>
                        ),
                        onClick: () =>
                          updateDesign((design) =>
                            updateType(design, id, "baseText")
                          ),
                      },
                      {
                        content: (
                          <>
                            <FaHeading />
                            Heading
                          </>
                        ),
                        onClick: () =>
                          updateDesign((design) =>
                            updateType(design, id, "baseHeading")
                          ),
                      },
                      {
                        content: (
                          <>
                            <LuUngroup />
                            Group (label)
                          </>
                        ),
                        onClick: () =>
                          updateDesign((design) =>
                            updateType(design, id, "baseGroup")
                          ),
                      },
                    ].map(({ content }, index) => (
                      <MenuItem key={index} className="flex items-center gap-2">
                        <Button disabled>{content}</Button>
                      </MenuItem>
                    ))}
                  </SubMenu>
                </Menu>
              </li>
            </ul>
          );
        }}
        clickable
        delayShow={400}
        delayHide={200}
      />
    </div>
  );
};
