import React from "react";
import { toast } from "react-toastify";

interface CopyToClipboardProps {
  text: string;
  children?: React.ReactNode;
}

const notifyOnSuccess = () => {
  toast("Copied! 🎉");
};

const CopyToClipboard: React.FC<CopyToClipboardProps> = ({
  text,
  children,
}) => {
  const copyTextToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      notifyOnSuccess();
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div
      onClick={() => copyTextToClipboard(text)}
      style={{ cursor: "pointer", userSelect: "none" }}
    >
      {children || text}
    </div>
  );
};

export default CopyToClipboard;
