import { Button, type ButtonProps } from "~/components/ui/buttons/Button";

export const BUTTON_CN =
  "hover flex-y common-transition hover:text-[#fff] max-w-[190px] h-full px-3 truncate";

export const ToolbarButton = (props: ButtonProps) => {
  return <Button baseCn={BUTTON_CN} {...props} />;
};
