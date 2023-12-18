import type { SVGProps } from "react";
const SvgGlassdoor = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 1024 1024"
    fill="currentColor"
    {...props}
  >
    <circle
      cx={512}
      cy={512}
      r={512}
      style={{
        fill: "#0caa41",
      }}
    />
    <path
      d="M621.7 694.9H329.1c0 40.4 32.7 73.1 73.1 73.1h219.4c40.4 0 73.1-32.7 73.1-73.1V394.5c0-1.5-1.2-2.7-2.7-2.7h-67.8c-1.5 0-2.7 1.2-2.7 2.7v300.4zm0-438.9c40.4 0 73.1 32.7 73.1 73.1H402.3v300.4c0 1.5-1.2 2.7-2.7 2.7h-67.8c-1.5 0-2.7-1.2-2.7-2.7V329.1c0-40.4 32.7-73.1 73.1-73.1z"
      style={{
        fill: "#fff",
      }}
    />
  </svg>
);
export default SvgGlassdoor;
