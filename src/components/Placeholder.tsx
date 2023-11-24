import cn from "classnames";
import { Link } from "./ui/buttons/Link";
import { Button } from "./ui/buttons/Button";
import { FaWindowRestore } from "react-icons/fa";

type PlaceholderProps = {
  title?: React.ReactNode;
  text?: React.ReactNode;
  to?: string;
  actionContent?: React.ReactNode;
  newTab?: boolean;
  className?: string;
  onClick?: () => void;
};

export const Placeholder = (props: PlaceholderProps) => {
  const {
    title = "Nothing yet",
    text = (
      <>
        Click &quot;Get CV&quot; under a vacancy <br /> or just drag and drop it
        into &quot;Create&quot; tab.
      </>
    ),
    to,
    actionContent = "Get started",
    newTab,
    className,
    onClick,
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
    <div className={cn("top-offset flex h-[80vh] justify-center", className)}>
      <div className="flex-center flex-col gap-5 rounded-md bg-primary p-5 text-center">
        <span className="flex flex-col gap-1">
          <span className="h4">{title} 🐈</span>
          <span>{text}</span>
        </span>
        {ActionElement}
      </div>
    </div>
  );
};
