import { useComponentContext } from "../contexts/ComponentContext";
import { useDesignContext } from "../contexts/DesignContext";
import { Autoresize } from "./Autoresize";

const { log } = console;

const HEADING_CN =
  "text-[34px] font-semibold uppercase leading-9 tracking-wide";

export const Heading = () => {
  const { design } = useDesignContext();
  const c = useComponentContext();

  const userNameProps = {
    className:
      design.baseComponents?.[`heading-${c.hydratedProps?.grade}`]?.className ??
      HEADING_CN,
    ...c.hydratedProps,
  };

  return <Autoresize {...userNameProps} />;
};
