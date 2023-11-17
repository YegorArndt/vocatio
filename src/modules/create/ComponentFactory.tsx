import { useDraftContext } from "../draft/DraftContext";
import { Autoresize } from "~/components/ui/inputs/components/Autoresize";
import { Timeline } from "~/modules/create/timeline";
import { Group } from "./components/Group";
import { Divider } from "./components/Divider";
import { Heading } from "./components/Heading";
import { UserImage } from "./components/UserImage";
import { useComponentContext } from "./ComponentContext";
import { CSSProperties } from "react";

interface ComponentConfig {
  className?: string;
  style?: CSSProperties;
  [key: string]: unknown;
}

const componentMapping = {
  text: Autoresize,
  group: Group,
  divider: Divider,
  timeline: Timeline,
  image: UserImage,
};

const mergeClassNames = (...classNames: (string | undefined)[]) =>
  classNames.filter(Boolean).join(" ");

const mergeStyles = (...styles: (CSSProperties | undefined)[]) =>
  Object.assign({}, ...styles) as CSSProperties;

export const ComponentFactory = () => {
  const { design } = useDraftContext();
  const c = useComponentContext();
  const { type, id, props: componentProps } = c;

  const componentConfig = (design.components[type] || {}) as ComponentConfig;
  const { className, style, ...designPropsWithoutClassName } = componentConfig;

  const {
    className: componentClassName,
    style: componentStyle,
    ...componentPropsWithoutClassName
  } = componentProps;

  const mergedClassNames = mergeClassNames(className, componentClassName, type);
  const mergedStyles = mergeStyles(style, componentStyle);

  const mergedProps = {
    ...designPropsWithoutClassName,
    ...componentPropsWithoutClassName,
    style: mergedStyles,
    className: mergedClassNames,
  };

  const Component = type.includes("heading")
    ? Heading
    : componentMapping[type as keyof typeof componentMapping];

  return (
    Component ? <Component id={id} {...(mergedProps as any)} /> : null
  ) as JSX.Element | null;
};
