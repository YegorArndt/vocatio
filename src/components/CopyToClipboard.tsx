import { ReactNode } from "react";
import { toast } from "sonner";

import { type ToasterProps } from "./external/Sonner";

type CopyToClipboardProps = {
  children: (copyHandler: (text: string) => Promise<void>) => ReactNode;
  toasterProps?: ToasterProps;
  textOnCopy?: string;
};

const defaultToasterProps: ToasterProps = {
  position: "bottom-left",
};

const notifyOnSuccess = (
  textOnCopy = "Copied to clipboard.",
  props = defaultToasterProps
) => {
  toast(textOnCopy, props);
};

const CopyToClipboard = (props: CopyToClipboardProps) => {
  const { children, textOnCopy, toasterProps } = props;

  const copyTextToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      notifyOnSuccess(textOnCopy, toasterProps);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return <>{children(copyTextToClipboard)}</>;
};

export default CopyToClipboard;
