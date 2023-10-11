import { Logo } from "./Logo";

type LoadingProps = {
  height?: string;
  width?: string;
};

export const Loading = (props: LoadingProps) => {
  const { height, width } = props;

  return (
    <div
      role="status"
      className="flex h-56 max-w-sm animate-pulse items-center justify-center rounded-lg bg-secondary-hover"
      style={{ height, width }}
    >
      <Logo />
      <span className="sr-only">Loading...</span>
    </div>
  );
};
