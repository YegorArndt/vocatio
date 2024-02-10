import { useComponentContext } from "../contexts/ComponentContext";
import { useDesignContext } from "../contexts/DesignContext";
import { Autoresize } from "./Autoresize";
import { useCurrentDraft } from "~/hooks/useCurrentDraft";
import { Spinner } from "~/components";

const { log } = console;

const JOB_TITLE_CN = "text-[24px] text-[#008cff] leading-7";

export const JobTitle = () => {
  const { design } = useDesignContext();
  const c = useComponentContext();
  const { currentDraft } = useCurrentDraft();

  if (!currentDraft?.jobTitle) return <Spinner />;

  const jobTitleProps = {
    className: design.baseComponents?.jobTitle?.className ?? JOB_TITLE_CN,
    value: currentDraft?.vacancy?.jobTitle,
    ...c.hydratedProps,
  };

  return <Autoresize {...jobTitleProps} />;
};
