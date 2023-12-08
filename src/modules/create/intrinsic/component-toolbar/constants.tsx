import { BsArrowsCollapse } from "react-icons/bs";
import { FaBold, FaItalic, FaUnderline } from "react-icons/fa";
import { RxLetterCaseUppercase } from "react-icons/rx";

export const CLASSNAME_ACTIVE = "bg-gray transition";

export const classNames = [
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
