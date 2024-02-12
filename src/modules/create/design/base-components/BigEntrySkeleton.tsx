export const BigEntrySkeleton = () => {
  return (
    <div className="flex-y gap-5 py-5">
      <div className="h-[50px] w-[50px] shrink-0 animate-pulse rounded-full bg-grayD" />
      <div className="flex w-full flex-col gap-2">
        <div className="h-[15px] w-full animate-pulse rounded-md bg-grayD" />
        <div className="h-[5px] w-3/4 animate-pulse rounded-md bg-grayD" />
        <div className="h-[5px] w-3/4 animate-pulse rounded-md bg-grayD" />
        <div className="h-[5px] w-3/4 animate-pulse rounded-md bg-grayD" />
        <div className="h-[5px] w-3/4 animate-pulse rounded-md bg-grayD" />
        <div className="h-[5px] w-3/4 animate-pulse rounded-md bg-grayD" />
        <div className="h-[5px] w-3/4 animate-pulse rounded-md bg-grayD" />
      </div>
    </div>
  );
};
