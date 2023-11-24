import { type CSSProperties } from "react";

type PageBreakProps = {
  style: CSSProperties;
};

export const PageBreak = (props: PageBreakProps) => {
  return (
    <div className="page-break absolute inset-0" {...props}>
      <small>Just hit Enter to adjust content&quot;s position</small>
    </div>
  );
};
