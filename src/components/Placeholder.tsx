import cn from "classnames";
import { Link } from "./ui/buttons/Link";
import { Button } from "./ui/buttons/Button";
import { FaWindowRestore } from "react-icons/fa";
import { PropsWithChildren, ReactNode } from "react";

type PlaceholderProps = PropsWithChildren<{
  title?: ReactNode;
  text?: ReactNode;
  to?: string;
  actionContent?: ReactNode;
  newTab?: boolean;
  className?: string;
  onClick?: () => void;
}>;

export const Placeholder = (props: PlaceholderProps) => {
  const {
    title = "Nothing yet",
    text = 'Start by clicking "Generate CV" under a vacancy',
    to,
    actionContent = "Get started",
    newTab,
    className,
    onClick,
    children,
  } = props;

  const ActionElement = to ? (
    <Link
      to={to}
      className="flex-center gap-2 clr-blue"
      newTab={newTab || !to.includes("vacancies")}
    >
      <FaWindowRestore /> {actionContent}
    </Link>
  ) : (
    <Button className="flex-center gap-2 clr-blue" onClick={onClick}>
      <FaWindowRestore /> {actionContent}
    </Button>
  );

  return (
    <div className={cn("flex h-[80vh] justify-center", className)}>
      <div className="flex-center flex-col gap-5 rounded-md bg-primary p-5 text-center">
        <span className="flex flex-col gap-1">
          <span className="h4">{title}&nbsp; 🐈</span>
          <span>{text}</span>
        </span>
        {actionContent && ActionElement}
        {children}
      </div>
    </div>
  );
};
