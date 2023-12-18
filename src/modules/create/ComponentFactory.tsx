import { useComponentContext } from "./ComponentContext";
import { useDraftContext } from "../draft/DraftContext";
import { mergeWithIntrinsic } from "../utils/mergeWithIntrinsic";
import { Autoresize, IconGroup, Divider } from "./intrinsic";
import { BlurImage } from "~/components";
import { NormalizedType } from "../draft/types/components";
import { DndProvider } from "./DndProvider";

const componentMapping: Record<NormalizedType, any> = {
  text: Autoresize,
  group: IconGroup,
  "icon-group": IconGroup,
  divider: Divider,
  image: BlurImage,
  entries: DndProvider,
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
    componentMapping[c.type as keyof typeof componentMapping] || Autoresize;

  return <Component id={c.id} {...m.props} />;
};
