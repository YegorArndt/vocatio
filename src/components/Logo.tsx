import classNames from "classnames";
import { Roboto } from "next/font/google";

type LogoProps = {
  className?: string;
};

const roboto = Roboto({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

export const Logo = (props: LogoProps) => {
  const { className } = props;

  return (
    <span className={classNames("text-[1.2rem]", roboto.className)}>
      Careerpilot
    </span>
  );
};
