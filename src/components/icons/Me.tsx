import * as React from "react";
import type { SVGProps } from "react";
const SvgMe = (props: SVGProps<SVGSVGElement>) => (
  <svg
    className="me_svg__typesCreatedBy"
    style={{
      width: 20,
      height: 20,
      display: "block",
      fill: "inherit",
      flexShrink: 0,
    }}
    viewBox="0 0 16 16"
    width="1em"
    height="1em"
    {...props}
  >
    <path d="M8 15.126c3.862 0 7.062-3.192 7.062-7.062 0-3.862-3.2-7.061-7.069-7.061-3.862 0-7.055 3.2-7.055 7.061 0 3.87 3.2 7.062 7.062 7.062m0-4.703c-1.948 0-3.452.69-4.17 1.49a5.646 5.646 0 0 1-1.497-3.849 5.642 5.642 0 0 1 5.66-5.667 5.66 5.66 0 0 1 5.68 5.667 5.62 5.62 0 0 1-1.503 3.85c-.718-.8-2.222-1.491-4.17-1.491m0-1.121c1.326.007 2.352-1.121 2.352-2.591 0-1.38-1.033-2.53-2.352-2.53-1.312 0-2.358 1.15-2.352 2.53C5.655 8.18 6.681 9.288 8 9.3" />
  </svg>
);
export default SvgMe;
