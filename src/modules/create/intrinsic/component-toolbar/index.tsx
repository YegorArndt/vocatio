import { type DraggableAttributes } from "@dnd-kit/core";
import { type SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import {
  Fragment,
  useState,
  type HTMLAttributes,
  type PropsWithChildren,
  useCallback,
} from "react";
import { HiOutlineArrowPath } from "react-icons/hi2";
import { Tooltip } from "react-tooltip";
import cn from "classnames";
import { IoAddCircleSharp } from "react-icons/io5";
import { MenuDivider, MenuHeader, SubMenu } from "@szhsin/react-menu";
import { RiDeleteBin6Line, RiDragMove2Fill } from "react-icons/ri";
import { IoTextSharp } from "react-icons/io5";
import { LuCopyPlus } from "react-icons/lu";
import { BsArrowsCollapse, BsArrowsExpand } from "react-icons/bs";

import { Button } from "~/components/ui/buttons/Button";
import { useDraftContext } from "~/modules/draft/DraftContext";
import { useComponentContext } from "../../ComponentContext";
import {
  isDecoration,
  isEntries,
  isGroup,
  isHeading,
  isImage,
  isText,
  typedKeys,
} from "~/modules/draft/utils/common";
import { mergeWithIntrinsic } from "~/modules/utils/mergeWithIntrinsic";
import { useCrudContext } from "../../DndProvider";
import { debounce, startCase } from "lodash-es";
import { BlurImage, Chip } from "~/components";
import { SlMagicWand } from "react-icons/sl";
import { useForm } from "react-hook-form";
import { Textarea } from "~/components/ui/inputs/Textarea";
import { TfiWrite } from "react-icons/tfi";
import { api } from "~/utils";
import { toast } from "react-toastify";
import Image from "next/image";
import {
  BUTTON_CN,
  SmChevron,
  ToolbarButton,
  textClassNames,
} from "./constants";
import { CustomMenu } from "~/components/external/CustomMenu";
import { CustomMenuButton } from "~/components/external/CustomMenuButton";
import { CustomMenuItem } from "~/components/external/CustomMenuItem";

const { log } = console;

type ComponentToolbarProps = PropsWithChildren<{
  dndRef: (node: HTMLElement | null) => void;
  listeners: SyntheticListenerMap | undefined;
  attributes: DraggableAttributes;
  decorated?: boolean;
  index: number;
}> &
  HTMLAttributes<HTMLDivElement>;

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
      I&apos;m on it...
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

  const { type, id } = c;
  const { intrinsic } = design;

  const { control, watch } = useForm();

  const canEditText = !isDecoration(type) && !isEntries(type);
  const canTurnInto = !isDecoration(type) && !isEntries(type);
  const canGpt = isText(type);

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
  const { mutate: applyCondensation } = api.hf.condense.useMutation({
    onSuccess: (condensed) => {
      notifyOnSuccess();
      const newProps = { ...c.props, value: condensed };
      c.props = newProps;
      updateDesign();
    },
  });

  const { mutate: applyElaboration } = api.hf.elaborate.useMutation({
    onSuccess: (elaborated) => {
      notifyOnSuccess();
      const newProps = { ...c.props, value: `${c.props.value} ${elaborated}` };
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

  const { mutate: applyAdjustment } = api.gpt.adjust.useMutation({
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
  const condense = () => {
    const text = c.props.value;
    if (!text) return;

    notifyOnStart();
    const { length } = text;
    const lengthMinus20Percent = Math.max(length * 0.8, 56);
    applyCondensation({ text, length: lengthMinus20Percent });
  };

  const elaborate = () => {
    const text = c.props.value;
    if (!text) return;

    notifyOnStart();
    applyElaboration({ text });
  };

  const convert = (target: "bulletPoints" | "text") => {
    const text = c.props.value;
    if (!text) return;

    notifyOnStart();
    applyConversion({ text, target });
  };

  const custom = () => {
    const text = c.props.value;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    const userCommand =
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      watch("custom");
    if (!text || !userCommand) return;

    notifyOnStart();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    applyCustom({
      text,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      userCommand,
    });
  };

  // const adjust = async () => {
  //   const text = c.props.value;
  //   if (!text) return;

  //   notifyOnStart();
  //   applyAdjustment({
  //     context: vacancy.requiredSkills,
  //     textToAdjust: c.props.summary,
  //   });
  // };

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
        place={
          !["left", "right"].includes(c.sectionId) && c.type === "entries"
            ? "bottom"
            : "top"
        }
        hidden={isTyping}
        opacity={1}
        globalCloseEvents={{ clickOutsideAnchor: true }}
        className={cn("z-tooltip h-[40px] border !p-0 [&>*]:h-full", {
          hidden: isTyping,
          "-translate-y-[0.5rem]": ["left", "right"].includes(c.sectionId),
        })}
        clickable
        openOnClick
        delayShow={400}
        delayHide={200}
        render={() => {
          return (
            <ul
              className="flex-center [&>li+li]:border-left size-full rounded-md clr-secondary [&_li]:h-full"
              data-html2canvas-ignore
            >
              {canEditText && (
                <li>
                  <CustomMenu
                    menuButton={
                      <CustomMenuButton>
                        <IoTextSharp />
                        <SmChevron />
                      </CustomMenuButton>
                    }
                  >
                    {textClassNames.map(({ icon, label, className }) => {
                      const m = mergeWithIntrinsic(c, design);

                      return (
                        <CustomMenuItem
                          key={className}
                          onClick={() => toggleClassName(m, className)}
                          className={cn({
                            "bg-gray transition":
                              m.props.className.includes(className),
                          })}
                        >
                          {icon}
                          {label}
                        </CustomMenuItem>
                      );
                    })}
                  </CustomMenu>
                </li>
              )}
              <li {...listeners} {...attributes}>
                <ToolbarButton
                  text={`Move ${c?.props?.tooltip}`}
                  endIcon={<RiDragMove2Fill />}
                />
              </li>
              <li>
                <ToolbarButton onClick={() => addComponent(c)}>
                  <LuCopyPlus />
                </ToolbarButton>
              </li>
              <li>
                <CustomMenu
                  menuButton={
                    <CustomMenuButton>
                      <IoAddCircleSharp />
                      <SmChevron />
                    </CustomMenuButton>
                  }
                >
                  <MenuHeader className="normal-case">Add below</MenuHeader>
                  <MenuDivider />
                  {typedKeys(intrinsic).map((typeOfComponent) => {
                    if (isImage(typeOfComponent)) return;

                    return (
                      <CustomMenuItem
                        key={typeOfComponent}
                        onClick={() =>
                          addComponent({
                            ...c,
                            type: typeOfComponent,
                            sectionId: c.sectionId,
                          })
                        }
                      >
                        <BlurImage
                          src={`/intrinsic/${typeOfComponent}.png`}
                          height={50}
                          width={50}
                          alt=""
                        />
                        {startCase(typeOfComponent)}
                      </CustomMenuItem>
                    );
                  })}
                </CustomMenu>
              </li>
              <li>
                <ToolbarButton
                  text={`Delete ${c?.props?.tooltip}`}
                  frontIcon={<RiDeleteBin6Line />}
                  onClick={() => removeComponent(c)}
                />
              </li>
              {canGpt && (
                <li>
                  <CustomMenu
                    menuButton={
                      <Button className={BUTTON_CN}>
                        <BlurImage
                          src="/gpt-logo.jpg"
                          height={30}
                          width={30}
                          alt="GPT Logo"
                        />
                      </Button>
                    }
                  >
                    <MenuHeader className="flex-center">
                      <Chip text="Beta" className="bg-sky w-11 clr-white" />
                    </MenuHeader>
                    <CustomMenuItem>
                      <SlMagicWand /> Adjust to vacancy
                    </CustomMenuItem>
                    <CustomMenuItem onClick={void condense}>
                      <BsArrowsCollapse /> Condense
                    </CustomMenuItem>
                    <CustomMenuItem onClick={elaborate}>
                      <BsArrowsExpand /> Elaborate
                    </CustomMenuItem>
                    <MenuDivider />
                    <SubMenu
                      label={
                        <span className="flex-y gap-2">
                          <TfiWrite />
                          Rewrite...
                        </span>
                      }
                    >
                      <CustomMenuItem
                        onClick={() => void convert("bulletPoints")}
                      >
                        <BsArrowsCollapse /> To a bullet list
                      </CustomMenuItem>
                      <CustomMenuItem onClick={() => void convert("text")}>
                        <BsArrowsExpand /> To a thorough description
                      </CustomMenuItem>
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
                    <CustomMenuItem onClick={void custom}>
                      <BlurImage
                        src="/gpt-logo.jpg"
                        height={20}
                        width={20}
                        alt=""
                      />
                      Apply
                    </CustomMenuItem>
                  </CustomMenu>
                </li>
              )}
              {canTurnInto && (
                <li>
                  <CustomMenu
                    menuButton={
                      <CustomMenuButton>
                        <HiOutlineArrowPath />
                        <SmChevron />
                      </CustomMenuButton>
                    }
                  >
                    <MenuHeader className="normal-case">Turn into</MenuHeader>
                    <MenuDivider />
                    {typedKeys(intrinsic).map((typeOfComponent) => {
                      if (
                        typeOfComponent === type ||
                        isDecoration(typeOfComponent)
                      )
                        return;

                      if (
                        (isText(type) || isHeading(type)) &&
                        isGroup(typeOfComponent)
                      )
                        return;
                      if (
                        isGroup(type) &&
                        (isText(typeOfComponent) || isHeading(typeOfComponent))
                      )
                        return;

                      return (
                        <CustomMenuItem
                          key={typeOfComponent}
                          onClick={() =>
                            changeComponentType(c, typeOfComponent)
                          }
                        >
                          <BlurImage
                            src={`/intrinsic/${typeOfComponent}.png`}
                            height={50}
                            width={50}
                            alt=""
                          />
                          {startCase(typeOfComponent)}
                        </CustomMenuItem>
                      );
                    })}
                  </CustomMenu>
                </li>
              )}
            </ul>
          );
        }}
      />
    </div>
  );
};
