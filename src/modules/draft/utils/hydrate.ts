import { type Defaults, dbIds } from "../constants";
import type {
  NormalizedComponent,
  Obligatory,
  ObligatoryProps,
  RawComponent,
} from "../types/components";

/**
 * Provides default values for components.
 */
export const hydrate = (
  c: (RawComponent | NormalizedComponent) &
    Obligatory & { props: ObligatoryProps },
  defaults: Defaults,
  dbId: (typeof dbIds)[number]
): NormalizedComponent => {
  const { modifierIds, props } = c;
  let hydratedProps: NormalizedComponent["props"];

  if (modifierIds) {
    const defaultValues = modifierIds.map((id) => ({
      [id]: defaults[id],
    }));
    hydratedProps = { ...props, defaultValues };
  } else {
    hydratedProps = { ...props, value: defaults?.[dbId] ?? props?.value };
  }

  return {
    ...c,
    props: hydratedProps,
  };
};
