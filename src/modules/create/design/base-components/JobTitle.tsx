import { useComponentContext } from "../contexts/ComponentContext";
import { useDesignContext } from "../contexts/DesignContext";
import { Autoresize } from "./Autoresize";
import { useCvContext } from "~/hooks/useCvContext";

const { log } = console;

const JOB_TITLE_CN = "text-[24px] text-[#008cff] leading-7";

export const JobTitle = () => {
  const { design } = useDesignContext();
  const c = useComponentContext();
  const { cv } = useCvContext() ?? {};

  if (!cv) return <div className="light-skeleton h-[20px] w-full" />;

  const jobTitleProps = {
    className: design.baseComponents?.jobTitle?.className ?? JOB_TITLE_CN,
    value: cv?.jobTitle,
    ...c.hydratedProps,
  };

  return <Autoresize {...jobTitleProps} />;
};
