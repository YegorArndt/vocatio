import { Spinner } from "~/components";
import { api } from "~/utils";
import { Autoresize } from "../design/base-components/Autoresize";
import { useComponentContext } from "../design/contexts/ComponentContext";
import { useDesignContext } from "../design/contexts/DesignContext";

const { log } = console;

const JOB_TITLE_CN = "text-[24px] text-[#008cff] leading-7";

export const DefaultJobTitle = () => {
  const { design } = useDesignContext();
  const c = useComponentContext();
  const { data: user, isLoading: isUserLoading } = api.users.get.useQuery();

  log("user");

  if (!user) return <Spinner />;

  const jobTitleProps = {
    ...c.hydratedProps,
    className: design.baseComponents?.jobTitle?.className ?? JOB_TITLE_CN,
    value: user.jobTitle,
  };

  return <Autoresize {...jobTitleProps} />;
};
