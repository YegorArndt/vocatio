import * as React from "react";
import type { SVGProps } from "react";
const SvgPerkCheck = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="1em"
    height="1em"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={1.5}
    className="perk-check_svg__with-icon_icon__MHUeb"
    data-testid="geist-icon"
    shapeRendering="geometricPrecision"
    style={{
      color: "currentColor:currentColor",
      width: 20,
      height: 20,
    }}
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      fill="#fff"
      stroke="#fff"
      d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2"
    />
    <path fill="none" stroke="currentColor" d="m8 11.857 2.5 2.5L15.857 9" />
  </svg>
);
export default SvgPerkCheck;
