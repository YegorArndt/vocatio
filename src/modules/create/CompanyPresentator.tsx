import { BlurImage, Spinner } from "~/components";
import { useCvContext } from "~/hooks/useCvContext";
import { cn } from "~/utils";
import { PartialVacancy } from "../types";

export const CompanyPresentator = (props: {
  vacancy?: PartialVacancy;
  className?: string;
}) => {
  const { className } = props;
  const { gen } = useCvContext() ?? {};
  const { vacancy = props.vacancy } = gen ?? {};

  return vacancy ? (
    <div className={cn("flex-y gap-3", className)}>
      <BlurImage src={vacancy?.image} height={30} width={30} rounded />
      <p>{vacancy?.companyName}</p>
    </div>
  ) : (
    <Spinner size={10} />
  );
};
