import cn from "classnames";
import Image from "next/image";

type LogoProps = {
  className?: string;
};

export const Logo = (props: LogoProps) => {
  const { className } = props;

  return (
    <Image
      src="/vercel-icon-light.png"
      alt="Chirp Logo"
      width={25}
      height={25}
      className={cn("rotate-180 transform", className)}
    />
  );
};
