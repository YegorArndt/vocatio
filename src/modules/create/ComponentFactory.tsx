import { Textarea } from "~/components/ui";
import { H3WithDivider } from "~/components/ui/h/H3WithDivider";
import { PhoneInput } from "~/components/ui/inputs/components/PhoneInput";
import { TextareaWithLabel } from "~/components/ui/inputs/components/TextareaWithLabel";
import { UrlInput } from "~/components/ui/inputs/components/UrlInput";
import type { DraftComponent } from "../draft/types";

const componentMapping = {
  TEXT: Textarea,
  DATE: Textarea,
  SELECT: Textarea,
  PHONE_NUMBER: PhoneInput,
  PHONE_NUMBER_WITH_LABEL: TextareaWithLabel,
  TEXT_WITH_LABEL: TextareaWithLabel,
  DATE_WITH_LABEL: TextareaWithLabel,
  SELECT_WITH_LABEL: TextareaWithLabel,
  URL: UrlInput,

  // TODO:
  LOCATION: Textarea,
  LOCATION_WITH_LABEL: TextareaWithLabel,
  LANGUAGE: Textarea,
  H1: Textarea,
  H2: Textarea,
  H3: Textarea,
  H4: Textarea,
  H5: Textarea,
  H6: Textarea,
  H1_WITH_DIVIDER: H3WithDivider,
  H2_WITH_DIVIDER: H3WithDivider,
  H3_WITH_DIVIDER: H3WithDivider,
  H4_WITH_DIVIDER: H3WithDivider,
  H5_WITH_DIVIDER: H3WithDivider,
};

type ComponentFactoryProps = {
  component: DraftComponent;
} & Record<string, unknown>;

export const ComponentFactory = (props: ComponentFactoryProps) => {
  const { component: c } = props;

  const ResultComponent = componentMapping[c.component] || Textarea;

  return <ResultComponent {...c} />;
};
