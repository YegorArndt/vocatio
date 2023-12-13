import { type DraggableAttributes } from "@dnd-kit/core";
import { type SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import {
  Fragment,
  useState,
  type HTMLAttributes,
  type PropsWithChildren,
  useCallback,
  ReactNode,
  forwardRef,
} from "react";
import { Tooltip } from "react-tooltip";
import { FaBold } from "react-icons/fa6";
import { FaItalic } from "react-icons/fa";
import cn from "classnames";
import { FaUnderline } from "react-icons/fa6";
import { IoAddCircleSharp } from "react-icons/io5";
import {
  Menu,
  MenuButton,
  MenuDivider,
  MenuHeader,
  MenuItem,
  SubMenu,
} from "@szhsin/react-menu";
import { RiDeleteBin6Line, RiDragMove2Fill } from "react-icons/ri";
import { IoTextSharp } from "react-icons/io5";
import { IoChevronUpOutline } from "react-icons/io5";
import { RxLetterCaseUppercase } from "react-icons/rx";
import { LuCopyPlus } from "react-icons/lu";
import { BsArrowsCollapse, BsArrowsExpand } from "react-icons/bs";

import { Button, ButtonProps } from "~/components/ui/buttons/Button";
import { useDraftContext } from "~/modules/draft/DraftContext";
import { useComponentContext } from "../../ComponentContext";
import {
  isDecoration,
  isImage,
  isText,
  typedKeys,
} from "~/modules/draft/utils/common";
import { getDirection, getMenuProps } from "./utils";
import { mergeWithIntrinsic } from "~/modules/utils/mergeWithIntrinsic";
import { useCrudContext } from "../../DndProvider";
import { debounce } from "lodash-es";
import { BlurImage, Chip } from "~/components";
import { SlMagicWand } from "react-icons/sl";
import { useForm } from "react-hook-form";
import { Textarea } from "~/components/ui/inputs/Textarea";
import { TfiWrite } from "react-icons/tfi";
import { api } from "~/utils";
import { toast } from "react-toastify";
import Image from "next/image";

const { log } = console;

type ComponentToolbarProps = PropsWithChildren<{
  dndRef: (node: HTMLElement | null) => void;
  listeners: SyntheticListenerMap | undefined;
  attributes: DraggableAttributes;
  decorated?: boolean;
  index: number;
}> &
  HTMLAttributes<HTMLDivElement>;

const classNames = [
  {
    icon: <FaBold />,
    label: "Bold",
    className: "font-bold",
  },
  {
    icon: <FaItalic />,
    label: "Italic",
    className: "italic",
  },
  {
    icon: <FaUnderline />,
    label: "Underline",
    className: "underline",
  },
  {
    icon: <BsArrowsCollapse style={{ transform: "rotate(90deg)" }} />,
    label: "Center",
    className: "text-center",
  },
  {
    icon: <RxLetterCaseUppercase />,
    label: "Upper",
    className: "uppercase",
  },
];

const SmChevron = (p: { menuDirection: "top" | "bottom" }) => (
  <IoChevronUpOutline
    size={8}
    style={{
      transform: p.menuDirection === "top" ? undefined : "rotate(180deg)",
    }}
  />
);

/**
 * Menu item.
 */
type MiProps = PropsWithChildren<{
  text?: string;
  icon?: ReactNode;
  className?: string;
  onClick?: () => void;
}>;
const Mi = (props: MiProps) => {
  const { text, icon, children = text, className, ...rest } = props;
  return (
    <MenuItem className={cn("flex-y gap-2", className as string)} {...rest}>
      {icon} {children}
    </MenuItem>
  );
};

/**
 * Menu button.
 */
type MbProps = PropsWithChildren<{
  text?: string;
  icon?: ReactNode;
  className?: string;
  onClick?: () => void;
}>;
const Mb = forwardRef((props: MbProps, ref) => {
  const { text, icon, children = text, className, ...rest } = props;
  return (
    <MenuButton
      className={cn(
        "flex-center hover common-transition gap-2 hover:text-[#fff]",
        className
      )}
      ref={ref}
      {...rest}
    >
      {icon} {children}
    </MenuButton>
  );
});

/**
 * Toolbar button.
 */
const ToolbarButton = (props: ButtonProps) => {
  return (
    <Button
      baseCn="hover flex-center common-transition gap-2 hover:text-[#fff]"
      {...props}
    />
  );
};

const ACTIVE = "bg-gray transition";

export const ComponentToolbar = (props: ComponentToolbarProps) => {
  const { dndRef, listeners, attributes, children, decorated, index, ...rest } =
    props;
  const [isTyping, setIsTyping] = useState(false);
  const c = useComponentContext();
  const {
    addComponent,
    removeComponent,
    toggleClassName,
    changeComponentType,
  } = useCrudContext();
  const { design, vacancy, updateDesign } = useDraftContext();

  const { type, id, sectionId } = c;
  const { intrinsic } = design;

  const { control, watch } = useForm();

  const menuDirection = getDirection(sectionId);

  const canEditText = !isDecoration(type);
  const canDuplicate = !isDecoration(type);
  const canTurnInto = !isDecoration(type);
  const canGpt = isText(type);

  /**
   * Toast on AI actions.
   */
  const notifyOnStart = () => {
    toast(
      <div className="flex-y gap-2">
        <Image
          src="/gpt-logo.jpg"
          height={30}
          width={30}
          alt="GPT Logo"
          className="spin-animation rounded-full"
        />
        I'm on it...
      </div>,
      {
        autoClose: false,
        toastId: "start",
      }
    );
  };

  const notifyOnSuccess = () => {
    toast.dismiss("start");
    toast(
      <div className="flex-y gap-2">
        <Image
          src="/gpt-logo.jpg"
          height={30}
          width={30}
          alt="GPT Logo"
          className="rounded-full"
        />
        Done! Hope you like it. 🤞
      </div>,
      {
        toastId: "success",
        autoClose: 4000,
      }
    );
  };

  /**
   * Hide tooltips on typing.
   */
  const debouncedOnKeyDown = useCallback(
    debounce(() => {
      setIsTyping(true);
    }, 1000),
    []
  );
  const debouncedOnKeyUp = useCallback(
    debounce(() => {
      setIsTyping(false);
    }, 2000),
    []
  );

  /**
   * Get AI methods.
   */

  // const { mutate, data, isLoading } = api.gpt.getCompletion.useMutation();

  const { mutate: applyCondensation, status } = api.hf.condense.useMutation({
    onSuccess: (condensed) => {
      notifyOnSuccess();
      const newProps = { ...c.props, value: condensed };
      c.props = newProps;
      updateDesign();
    },
  });

  const { mutate: applyConversion } = api.hf.convert.useMutation({
    onSuccess: (value) => {
      notifyOnSuccess();
      const newProps = { ...c.props, value };
      c.props = newProps;
      updateDesign();
    },
  });

  const { mutate: applyCustom } = api.hf.custom.useMutation({
    onSuccess: (value) => {
      notifyOnSuccess();
      const newProps = { ...c.props, value };
      c.props = newProps;
      updateDesign();
    },
  });

  /**
   * Compose TS methods.
   */
  const condense = async () => {
    const text = c.props.value;
    if (!text) return;

    notifyOnStart();
    const { length } = text;
    const lengthMinus20Percent = Math.max(length * 0.8, 56);
    applyCondensation({ text, length: lengthMinus20Percent });
  };

  const convert = async (target: "bulletPoints" | "text") => {
    const text = c.props.value;
    if (!text) return;

    notifyOnStart();
    applyConversion({ text, target });
  };

  const custom = async () => {
    const text = c.props.value;
    const userCommand = watch("custom");
    if (!text || !userCommand) return;

    notifyOnStart();
    applyCustom({ text, userCommand });
  };

  return (
    <div
      ref={dndRef}
      data-tooltip-id={id}
      className={cn({
        "relative pl-6": decorated,
        "flex-center": c.type === "image",
      })}
      onKeyDown={() => {
        if (!isTyping) setIsTyping(true);
        debouncedOnKeyDown();
      }}
      onKeyUp={debouncedOnKeyUp}
      {...rest}
    >
      {decorated && (
        <Fragment>
          <div className="z-1 absolute left-0 top-2 h-3 w-3 rounded-full border-2 border-solid border-black bg-white" />
          <div className="absolute left-[.36rem] top-2 h-full w-[0.5px] bg-black" />
        </Fragment>
      )}
      {children}
      <Tooltip
        id={id}
        place="top"
        hidden={isTyping}
        opacity={1}
        globalCloseEvents={{ clickOutsideAnchor: true }}
        className={cn("z-tooltip h-[40px] !px-0 py-3 [&>*]:h-full", {
          hidden: isTyping,
        })}
        clickable
        openOnClick
        delayShow={400}
        delayHide={200}
        render={() => {
          return (
            <ul
              className="flex-center [&>li+li]:border-left h-full w-full rounded-md clr-secondary [&_li]:h-full [&_li_button]:h-full [&_li_button]:px-3"
              data-html2canvas-ignore
            >
              {canEditText && (
                <li>
                  <Menu
                    menuButton={
                      <Mb>
                        <IoTextSharp />
                        <SmChevron menuDirection={menuDirection} />
                      </Mb>
                    }
                    {...getMenuProps(menuDirection)}
                  >
                    {classNames.map(({ icon, label, className }) => {
                      const m = mergeWithIntrinsic(c, design);

                      return (
                        <Mi
                          icon={icon}
                          text={label}
                          className={cn({
                            [ACTIVE]: m.props.className.includes(className),
                          })}
                          onClick={() => toggleClassName(m, className)}
                        />
                      );
                    })}
                  </Menu>
                </li>
              )}
              <li {...listeners} {...attributes}>
                <ToolbarButton
                  text={`Move ${c?.props?.tooltip}`}
                  endIcon={<RiDragMove2Fill />}
                />
              </li>
              {canDuplicate && (
                <li>
                  <ToolbarButton onClick={() => addComponent(c)}>
                    <LuCopyPlus />
                  </ToolbarButton>
                </li>
              )}
              <li>
                <Menu
                  menuButton={
                    <Mb>
                      <IoAddCircleSharp />
                      <SmChevron menuDirection={menuDirection} />
                    </Mb>
                  }
                  {...getMenuProps(menuDirection)}
                >
                  {typedKeys(intrinsic).map((typeOfComponent) => {
                    if (isImage(typeOfComponent)) return;

                    return (
                      <Mi
                        key={typeOfComponent}
                        text={typeOfComponent}
                        onClick={() =>
                          addComponent({ ...c, type: typeOfComponent })
                        }
                      />
                    );
                  })}
                </Menu>
              </li>
              <li>
                <ToolbarButton onClick={() => removeComponent(c)}>
                  <RiDeleteBin6Line />
                </ToolbarButton>
              </li>
              {canGpt && (
                <li>
                  <Menu
                    menuButton={
                      <Button className="flex-center">
                        <BlurImage
                          src="/gpt-logo.jpg"
                          height={30}
                          width={30}
                          alt="GPT Logo"
                        />
                      </Button>
                    }
                    {...getMenuProps(menuDirection)}
                  >
                    <MenuHeader className="flex-center">
                      <Chip text="Beta" className="bg-sky w-11 clr-white" />
                    </MenuHeader>
                    <Mi icon={<SlMagicWand />} text="Adjust to vacancy" />
                    <Mi
                      icon={<BsArrowsCollapse />}
                      text="Condense"
                      onClick={condense}
                    />
                    <Mi icon={<BsArrowsExpand />} text="Elaborate" />
                    <MenuDivider />
                    <SubMenu
                      label={
                        <span className="flex-y gap-2">
                          <TfiWrite />
                          Rewrite...
                        </span>
                      }
                    >
                      <Mi
                        text="To a bullet list"
                        onClick={() => convert("bulletPoints")}
                      />
                      <Mi
                        text="To a thorough description"
                        onClick={() => convert("text")}
                      />
                    </SubMenu>
                    <MenuDivider />
                    <MenuHeader>Or</MenuHeader>
                    <Textarea
                      name="custom"
                      control={control}
                      placeholder="Your command"
                      className="my-2 ml-4 !w-[85%] border !bg-white !px-4 [&>*]:!cursor-[black] [&>*]:!clr-black"
                      onClickCapture={(e) => e.stopPropagation()}
                    />
                    <Mi className="hover:bg-transparent">
                      <Button
                        frontIcon={
                          <BlurImage
                            src="/gpt-logo.jpg"
                            height={20}
                            width={20}
                            alt=""
                          />
                        }
                        text="Apply"
                        className="sm flex-y hover:bg-test rounded-md border bg-black clr-white"
                        onClick={custom}
                      />
                    </Mi>
                    {/* <MenuDivider />
                    <MenuHeader>Emphasize</MenuHeader>
                    {[
                      "My role in company's success",
                      "How I used tech stack specified",
                      "What hard skills I learned at the company",
                      "What soft skills I learned at the company",
                    ].map((option) => (
                      <MenuItem>
                        <Checkbox
                          control={control}
                          name={option}
                          label={option}
                        />
                      </MenuItem>
                    ))}
                    <MenuDivider />
                    <MenuHeader className="normal-case">
                      Max. one selection recommended
                    </MenuHeader> */}
                  </Menu>
                </li>
              )}
              {canTurnInto && (
                <li>
                  <Menu
                    menuButton={
                      <Mb>
                        Turn into <SmChevron menuDirection={menuDirection} />
                      </Mb>
                    }
                    {...getMenuProps(menuDirection)}
                  ></Menu>
                </li>
              )}
            </ul>
          );
        }}
      />
    </div>
  );
};
