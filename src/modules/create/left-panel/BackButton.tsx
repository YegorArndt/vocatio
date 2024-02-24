import { Link } from "~/components/ui/buttons/Link";
import { TiArrowBack } from "react-icons/ti";
import { NAV_BUTTON_CN } from "./constants";

type BackButtonProps = {
  to?: string;
  text?: string;
};

export const BackButton = (props: BackButtonProps) => {
  const { text = "My vacancies", to = "/vacancies" } = props;

  return (
    <Link
      to={to}
      text={text}
      frontIcon={<TiArrowBack size={20} />}
      baseCn="gap-2 whitespace-nowrap"
      className={NAV_BUTTON_CN}
    />
  );
};
