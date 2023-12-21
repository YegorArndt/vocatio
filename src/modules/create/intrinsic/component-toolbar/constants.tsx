import { BsArrowsCollapse } from "react-icons/bs";
import { FaBold, FaItalic, FaUnderline } from "react-icons/fa";
import { IoChevronUpOutline } from "react-icons/io5";
import { RxLetterCaseUppercase } from "react-icons/rx";
import { ButtonProps, Button } from "~/components/ui/buttons/Button";

export const CLASSNAME_ACTIVE = "bg-gray transition";

export const textClassNames = [
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

export const BUTTON_CN =
  "hover flex-y common-transition hover:text-[#fff] max-w-[190px] h-full px-3 truncate";

export const ToolbarButton = (props: ButtonProps) => {
  return <Button baseCn={BUTTON_CN} {...props} />;
};

export const SmChevron = () => <IoChevronUpOutline size={8} />;
