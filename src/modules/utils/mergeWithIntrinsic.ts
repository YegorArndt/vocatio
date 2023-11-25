import type { NormalizedComponent } from "../draft/types/components";
import type { Design } from "../draft/types/design";

export const mergeWithIntrinsic = (
  c: NormalizedComponent,
  d: Design
): NormalizedComponent => {
  const { intrinsic } = d;
  const intrinsicComponent = intrinsic[c.type];

  const { className: k, style: s } = c.props || {};

  const className = `${c.type} ${intrinsicComponent?.className || ""} ${k}`;
  const style = { ...(intrinsicComponent?.style || {}), ...s };

  const mergedProps = { ...intrinsicComponent, ...c.props, className, style };

  return { ...c, props: mergedProps } as NormalizedComponent;
};
