import cn from "classnames";
import { CvSkeleton } from "./CvSkeleton";

export const CreatePageSkeleton = (props: { className?: string }) => {
  const { className } = props;
  return (
    <div className={cn("flex w-screen justify-between px-5", className)}>
      <div className="grid max-h-[200px] animate-pulse grid-cols-2 gap-3 rounded-sm bg-skeleton p-3">
        <div className="h-[50px] w-[50px] rounded-sm bg-skeleton" />
        <div className="h-[50px] w-[50px] rounded-sm bg-skeleton" />
        <div className="h-[50px] w-[50px] rounded-sm bg-skeleton" />
        <div className="h-[50px] w-[50px] rounded-sm bg-skeleton" />
        <div className="h-[50px] w-[50px] rounded-sm bg-skeleton" />
        <div className="h-[50px] w-[50px] rounded-sm bg-skeleton" />
      </div>
      <CvSkeleton />
      <div />
    </div>
  );
};
