import { type CSSProperties } from "react";

type PageBreakProps = {
  style: CSSProperties;
};

export const PageBreak = (props: PageBreakProps) => {
  return (
    <div
      className="page-break absolute inset-0 z-pageBreak h-[10px] w-full bg-primary"
      {...props}
    />
  );
};
