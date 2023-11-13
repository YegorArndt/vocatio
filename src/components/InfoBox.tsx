import cn from "classnames";
import { useState, type ReactNode } from "react";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { FaTimes } from "react-icons/fa";
import { Button } from "./ui/buttons/Button";

type InfoBoxProps = {
  text: ReactNode;
  className?: string;
};

export const InfoBox = (props: InfoBoxProps) => {
  const { text, className } = props;
  const key = text?.toString().substring(0, 10);
  const [isClosed, setIsClosed] = useState(Boolean(localStorage.getItem(key!)));

  if (isClosed) return null;

  return (
    <span
      className={cn("flex items-center gap-5 rounded-md border p-3", className)}
    >
      <AiOutlineInfoCircle size={40} />
      <div>{text}</div>
      <Button
        onClick={() => {
          setIsClosed(true);
          localStorage.setItem(key!, "true");
        }}
      >
        <FaTimes size={10} className="mb-[3rem]" />
      </Button>
    </span>
  );
};
