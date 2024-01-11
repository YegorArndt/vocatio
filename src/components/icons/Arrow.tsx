import * as React from "react";
import type { SVGProps } from "react";
const SvgArrow = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="1em"
    height="1em"
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={1.5}
    className="arrow_svg__with-icon_icon__MHUeb"
    shapeRendering="geometricPrecision"
    style={{
      color: "currentcolor",
    }}
    viewBox="0 0 24 24"
    {...props}
  >
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);
export default SvgArrow;
