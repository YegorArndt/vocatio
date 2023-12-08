import { Button, type ButtonProps } from "~/components/ui/buttons/Button";

export const ToolbarButton = (props: ButtonProps) => {
  return (
    <Button
      baseCn="hover hover:text-[#fff] flex-center gap-2 common-transition"
      {...props}
    />
  );
};
