import cn from "classnames";

export const Divider = (props: { className?: string }) => {
  const { className } = props;
  return (
    <div
      role="separator"
      className={cn("my-2 h-[0.5px] w-full bg-border !p-0", className)}
    />
  );
};
