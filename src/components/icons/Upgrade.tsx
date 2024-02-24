import * as React from "react";
import type { SVGProps } from "react";
const SvgUpgrade = (props: SVGProps<SVGSVGElement>) => (
  <svg
    className="upgrade_svg__settingsUpgrade"
    style={{
      width: 20,
      height: 20,
      display: "block",
      fill: "inherit",
      flexShrink: 0,
    }}
    viewBox="0 0 20 20"
    width="1em"
    height="1em"
    {...props}
  >
    <path d="M9.969 17.938c4.36 0 7.969-3.618 7.969-7.97C17.938 5.61 14.32 2 9.96 2 5.609 2 2 5.61 2 9.969c0 4.351 3.617 7.969 7.969 7.969zm0-1.329a6.609 6.609 0 0 1-6.633-6.64 6.602 6.602 0 0 1 6.625-6.64 6.627 6.627 0 0 1 6.648 6.64 6.61 6.61 0 0 1-6.64 6.64zm0-2.734a.562.562 0 0 0 .586-.586V9.383l-.063-1.656.797.945.922.937a.52.52 0 0 0 .414.172c.32 0 .57-.242.57-.562a.566.566 0 0 0-.164-.406L10.43 6.219c-.149-.149-.29-.227-.461-.227-.164 0-.297.07-.453.227l-2.61 2.593a.555.555 0 0 0-.148.407c0 .32.242.562.562.562a.572.572 0 0 0 .414-.172l.93-.937.781-.938-.062 1.649v3.906c0 .344.25.586.586.586z" />
  </svg>
);
export default SvgUpgrade;
