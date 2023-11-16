import { type DraggableAttributes } from "@dnd-kit/core";
import { type SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { type HTMLAttributes, type PropsWithChildren } from "react";
import { Tooltip } from "react-tooltip";
import { IoHandLeftSharp } from "react-icons/io5";
import { FaBold } from "react-icons/fa6";
import { FaItalic } from "react-icons/fa";
import cn from "classnames";
import { FaUnderline } from "react-icons/fa6";

import { Button } from "~/components/ui/buttons/Button";
import { useDraftContext } from "~/modules/draft/DraftContext";
import { useComponentContext } from "../../useComponentContext";

type EditorTooltipProps = PropsWithChildren<{
  dndRef: (node: HTMLElement | null) => void;
  listeners: SyntheticListenerMap | undefined;
  attributes: DraggableAttributes;
}> &
  HTMLAttributes<HTMLDivElement>;

const classNames = [
  {
    label: <FaBold />,
    className: "font-bold",
  },
  {
    label: <FaItalic />,
    className: "italic",
  },
  {
    label: <FaUnderline />,
    className: "underline",
  },
];

const isActive = "-translate-y-1 transform !bg-secondary-hover transition";

export const EditorTooltip = (props: EditorTooltipProps) => {
  const { dndRef, listeners, attributes, children, ...rest } = props;
  const c = useComponentContext();
  const {
    draftState: { CHANGE_DESIGN_FIRED },
    toggleClassName,
  } = useDraftContext();

  return (
    <div ref={dndRef} data-tooltip-id={c.id} {...rest}>
      {children}
      {!CHANGE_DESIGN_FIRED && (
        <Tooltip
          id={c.id}
          place="top"
          opacity={1}
          style={{ paddingInline: 10, zIndex: 9999 }}
          globalCloseEvents={{ scroll: true, clickOutsideAnchor: true }}
          render={() => {
            return (
              <ul className="flex-center [&>li+li]:border-left w-full gap-3 rounded-md [&>li+li]:pl-3">
                <li {...listeners} {...attributes}>
                  <Button baseCn="navigation sm gap-2">
                    <IoHandLeftSharp /> Drag
                  </Button>
                </li>
                {classNames.map(({ label, className }) => {
                  return (
                    <li key={className}>
                      <Button
                        baseCn="navigation sm gap-2"
                        className={cn({
                          [isActive]: c.props.className.includes(className),
                        })}
                        onClick={() => toggleClassName(c, className)}
                      >
                        {label}
                      </Button>
                    </li>
                  );
                })}
              </ul>
            );
          }}
          clickable
          delayShow={400}
          delayHide={200}
        />
      )}
    </div>
  );
};
