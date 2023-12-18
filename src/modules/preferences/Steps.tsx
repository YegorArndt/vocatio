import cn from "classnames";
import { useState } from "react";
import { FcCheckmark } from "react-icons/fc";
import { HiOutlineExternalLink } from "react-icons/hi";
import { Spinner } from "~/components";
import { DecoProps } from "~/components/Spinner";
import { Link } from "~/components/ui/buttons/Link";

const Ball = (props: DecoProps) => {
  const { children, className } = props;

  return (
    <div
      className={cn(
        "flex-center h-[50px] w-[50px] rounded-full border bg-card",
        className
      )}
    >
      {children}
    </div>
  );
};

export const Steps = () => {
  const [step1Complete, setStep1Complete] = useState(false);
  const [step2Complete, setStep2Complete] = useState(false);

  return (
    <ul className="content flex max-w-[550px] flex-col gap-3">
      <li className="relative grid grid-cols-3 items-center">
        <div className="flex-center">
          <Ball
            className={cn({
              "bg-green": step1Complete,
              "font-bold": step1Complete,
            })}
          >
            1
          </Ball>
        </div>
        <div className="-ml-[40%] h-[0.5px] w-[190%] bg-border" />
        <div className="flex-center">
          <Ball>{step1Complete ? <Spinner size={15} /> : 2}</Ball>
        </div>
      </li>
      <li className="grid grid-cols-3">
        <div className="flex-center flex-wrap gap-1">
          <Link
            frontIcon={step1Complete ? <FcCheckmark /> : null}
            text="Visit your profile"
            endIcon={<HiOutlineExternalLink />}
            to="https://www.linkedin.com/in/"
            className="flex-y clr-blue hover:underline"
            newTab
            onClick={() => setStep1Complete(true)}
          />
        </div>
        <div />
        <div className="flex-center whitespace-nowrap text-center">
          Open the extension and click <br />✨ Share with Vocatio
        </div>
      </li>
    </ul>
  );
};
