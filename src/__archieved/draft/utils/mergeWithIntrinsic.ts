import cn from "classnames";

import type { NormalizedComponent } from "../types/components";
import type { Design } from "../types/design";

export const mergeWithIntrinsic = (
  c: NormalizedComponent,
  d: Design
): NormalizedComponent => {
  const { intrinsic } = d;
  const i = intrinsic[c.type];

  const { className: j, style: t } = i || {};
  const { className: k, style: s } = c.props || {};

  const className = cn(c.type, j, k);
  const style = { ...t, ...s };

  const mergedProps = { ...i, ...c.props, className, style };

  return { ...c, props: mergedProps };
};
