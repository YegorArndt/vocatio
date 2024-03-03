import { BlurImage, Spinner } from "~/components";
import { useCvContext } from "~/hooks/useCvContext";
import { cn } from "~/utils";

export const CompanyPresentator = (props: { className?: string }) => {
  const { className } = props;
  const { gen } = useCvContext() ?? {};
  const { vacancy } = gen ?? {};

  return vacancy ? (
    <div className={cn("flex-y gap-3", className)}>
      <BlurImage src={vacancy?.image} height={30} width={30} rounded />
      <p>{vacancy?.companyName}</p>
    </div>
  ) : (
    <Spinner />
  );
};
