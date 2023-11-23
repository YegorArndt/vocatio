import * as React from "react";
import type { SVGProps } from "react";
const SvgPhone = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    style={{
      fill: "#fff",
    }}
    viewBox="10 2 26 44"
    width="1em"
    height="1em"
    {...props}
  >
    <path
      d="M31 2H15c-2.76 0-5 2.24-5 5v34c0 2.76 2.24 5 5 5h16c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5m-8 42c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3m9-8H14V8h18z"
      style={{
        fill: "inherit",
      }}
    />
  </svg>
);
export default SvgPhone;
