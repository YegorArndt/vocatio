import { useEffect } from "react";
import { Spinner } from "./Spinner";
import { Button, ButtonProps } from "./ui/buttons/Button";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";

type SaveButtonProps = {
  disabled: boolean;
  isLoading: boolean;
  isSuccess: boolean;
  reset: () => void;
} & ButtonProps;

const propsSuccess: ButtonProps = {
  text: "Saved!",
  frontIcon: <IoMdCheckmarkCircleOutline />,
  className: "!bg-green !clr-white",
  disabled: true,
};

const propsLoading: ButtonProps = {
  text: "Saving...",
  frontIcon: <Spinner size={12} />,
  disabled: true,
};

const propsDefault: ButtonProps = {
  baseCn: "primary sm ml-auto w-1/5",
  type: "submit",
  text: "Save",
};

export const SaveButton = (props: SaveButtonProps) => {
  const { isLoading, isSuccess, reset, ...rest } = props;
  const baseProps = { ...propsDefault, ...rest };

  useEffect(() => {
    if (isSuccess) {
      const timeout = setTimeout(() => {
        reset();
      }, 2500);

      return () => clearTimeout(timeout);
    }
  }, [isSuccess]);

  if (isLoading) return <Button {...baseProps} {...propsLoading} />;

  if (isSuccess) return <Button {...baseProps} {...propsSuccess} />;

  return <Button {...baseProps} />;
};
