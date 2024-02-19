import { useComponentContext } from "../contexts/ComponentContext";
import { useDesignContext } from "../contexts/DesignContext";
import { Autoresize } from "./Autoresize";
import { useGeneratedData } from "~/hooks/useGeneratedData";
import { Spinner } from "~/components";

const { log } = console;

const JOB_TITLE_CN = "text-[24px] text-[#008cff] leading-7";

export const JobTitle = () => {
  const { design } = useDesignContext();
  const c = useComponentContext();
  const { generated } = useGeneratedData();

  if (!generated?.jobTitle) return <Spinner />;

  const jobTitleProps = {
    className: design.baseComponents?.jobTitle?.className ?? JOB_TITLE_CN,
    value: generated?.vacancy?.jobTitle ?? generated?.jobTitle,
    ...c.hydratedProps,
  };

  return <Autoresize {...jobTitleProps} />;
};
