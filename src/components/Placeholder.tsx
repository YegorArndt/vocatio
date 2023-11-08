import { Link } from "./ui/buttons/Link";
import { FaWindowRestore } from "react-icons/fa";

type PlaceholderProps = {
  title?: React.ReactNode;
  text?: React.ReactNode;
  to?: string;
  linkText?: React.ReactNode;
};

export const Placeholder = (props: PlaceholderProps) => {
  const {
    title = "Nothing yet 🐈",
    text = (
      <>
        Click &quot;Get CV&quot; under a vacancy <br /> or just drag and drop it
        into &quot;Create&quot; tab.
      </>
    ),
    to = "vacancies",
    linkText = "Get started",
  } = props;

  return (
    <div className="flex-center h-full">
      <div className="flex h-1/3 w-1/3 flex-col justify-center gap-5 rounded-md border bg-primary p-5 text-center">
        <span className="flex flex-col gap-1">
          <span className="h4">{title}</span>
          <span>{text}</span>
        </span>
        <Link to={to} className="flex-center gap-2 clr-blue">
          <FaWindowRestore /> {linkText}
        </Link>
      </div>
    </div>
  );
};
