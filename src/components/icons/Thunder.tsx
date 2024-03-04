import type { SVGProps } from "react";
const SvgThunder = (props: SVGProps<SVGSVGElement>) => (
  <svg
    className="thunder_svg__boltFilled"
    style={{
      width: "auto",
      height: "auto",
      display: "block",
      fill: "#d99e35",
      flexShrink: 0,
    }}
    viewBox="0 0 14 22"
    width="1em"
    height="1em"
    {...props}
  >
    <path d="M0 12.117c0 .38.293.664.703.664h5.518l-2.91 7.91c-.381 1.006.664 1.543 1.318.723l8.877-11.094c.166-.205.254-.4.254-.625 0-.371-.293-.664-.703-.664H7.539l2.91-7.91C10.83.115 9.785-.422 9.131.408L.254 11.492c-.166.215-.254.41-.254.625z" />
  </svg>
);
export default SvgThunder;
