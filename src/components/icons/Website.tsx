import * as React from "react";
import type { SVGProps } from "react";
const SvgWebsite = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    style={{
      fill: "currentcolor",
    }}
    viewBox="0 0 315.3 391.4"
    width="1em"
    height="1em"
    fill="currentColor"
    {...props}
  >
    <defs>
      <clipPath id="website_svg__a">
        <path d="M0 0h315.328v391.45H0Zm0 0" />
      </clipPath>
    </defs>
    <g clipPath="url(#website_svg__a)">
      <path
        d="M315.336 179.59 0-.004l43.184 356.719 86.125-97.75.449-.3 86.344 132.784 60.914-39.61-86.735-133.382.38-.254 124.675-38.613"
        style={{
          fill: "currentcolor",
        }}
      />
    </g>
  </svg>
);
export default SvgWebsite;
