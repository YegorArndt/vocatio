import { useComponentContext } from "./ComponentContext";
import { useDraftContext } from "../draft/DraftContext";
import { mergeWithIntrinsic } from "../utils/mergeWithIntrinsic";
import { Group, Divider } from "./intrinsic";
import { ImgHTMLAttributes } from "react";

const PlainImage = (props: ImgHTMLAttributes<HTMLImageElement>) => (
  <img {...props} />
);

const componentMapping = {
  divider: Divider,
  image: PlainImage,
};

/**
 * Merging with intrinsic props must happen at this stage.
 * This is because the intrinsic props might change when the user changes component's type.
 * So the props need to be recalculated dynamically - not at the init stage.
 */

export const ComponentFactory = () => {
  const c = useComponentContext();
  const { design } = useDraftContext();

  const m = mergeWithIntrinsic(c, design);

  const Component =
    componentMapping[c.type as keyof typeof componentMapping] || Group;

  return Component ? (
    <Component
      id={c.id}
      {...(m.props as unknown as {
        label: string;
        value: string;
        image: string;
        src: string;
        alt: string;
      })}
    />
  ) : null;
};
