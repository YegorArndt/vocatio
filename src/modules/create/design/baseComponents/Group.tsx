import { type CSSProperties, useState } from "react";
import cn from "classnames";
import {
  FocusableItem,
  Menu,
  MenuButton,
  MenuHeader,
  MenuItem,
} from "@szhsin/react-menu";

import {
  Autoresize,
  AutoresizeProps,
} from "~/modules/create/design/baseComponents/Autoresize";
import { typedKeys } from "~/__archieved/draft/utils/common";
import { Blur } from "~/components/Blur";
import { ImageProps } from "next/image";
import { rest, startCase } from "lodash-es";
import { useComponentContext } from "../contexts/ComponentContext";
import { icons } from "~/constants";
import { AnimatedDiv } from "~/components/AnimatedDiv";

export type GroupProps = {
  id: string;
  label: string;
  image: string;
  value: string;
  containerClassName?: string;
  containerStyle?: CSSProperties;

  imageSize?: number;

  labelProps?: AutoresizeProps;
  imageProps?: Partial<ImageProps> | undefined;
  valueProps?: AutoresizeProps;
};

type IconProps = Pick<GroupProps, "image" | "imageProps" | "imageSize">;

const BlurIcon = (props: ImageProps & { imageSize?: number }) => {
  const {
    src,
    imageSize,
    height = imageSize ?? 15,
    width = imageSize ?? 15,
    alt,
    className,
  } = props;
  const Icon = icons[src as keyof typeof icons];

  const pps = { height, width, alt, className };

  const icon = Icon ? <Icon {...pps} /> : <img {...pps} src={src as string} />;

  return <Blur element={icon} />;
};

const Icon = (props: IconProps) => {
  const { image, imageProps, imageSize } = props;
  const [filter, setFilter] = useState("");

  const c = useComponentContext();
  // const { updateDesign } = useDraftContext();

  // const onImageChange = (key: keyof typeof icons) => {
  //   const newProps = { ...c.props, image: key };
  //   c.props = newProps;
  //   // updateDesign();
  // };

  return (
    <Menu
      menuButton={
        <MenuButton>
          <BlurIcon
            src={image}
            imageSize={imageSize}
            {...(imageProps as { alt: string })}
          />
        </MenuButton>
      }
      direction="left"
      gap={25}
      transition
      portal
    >
      <MenuHeader>Change to</MenuHeader>
      <FocusableItem className="mb-2">
        {({ ref }) => (
          <input
            ref={ref}
            type="text"
            placeholder="Type to filter"
            value={filter}
            className={cn(
              "border-gray-300 focus:border-gray-500 w-full border-b bg-transparent p-2 focus:outline-none"
            )}
            onChange={(e) => setFilter(e.target.value)}
          />
        )}
      </FocusableItem>
      {typedKeys(icons)
        .filter((iconKey) =>
          iconKey.toUpperCase().includes(filter.trim().toUpperCase())
        )
        .map((i) => (
          <MenuItem
            key={i}
            className="flex items-center gap-4 first-letter:capitalize hover:bg-transparent"
            // onClick={() => onImageChange(i)}
          >
            <BlurIcon {...rest} {...(imageProps as { alt: string })} src={i} />
            {startCase(i)}
          </MenuItem>
        ))}
    </Menu>
  );
};

export const Group = () => {
  const { type, hydratedProps = {} } = useComponentContext();
  const {
    containerClassName,
    image,
    imageProps,
    label,
    labelProps,
    value,
    valueProps,
    imageSize,
  } = hydratedProps as GroupProps;

  /**
   * No need for a container if the type is text.
   */
  return type === "text" ? (
    <Autoresize value={value} {...valueProps} />
  ) : (
    <AnimatedDiv
      className={cn(
        containerClassName,
        "grid grid-cols-[15px_1fr] items-center gap-1"
      )}
    >
      {type === "icon-group" && <Icon image={image} imageProps={imageProps} />}

      {type === "group" && (
        <Autoresize type="label" value={label} {...labelProps} />
      )}

      <Autoresize value={value} {...valueProps} />
    </AnimatedDiv>
  );
};
