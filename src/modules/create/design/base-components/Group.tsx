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
} from "~/modules/create/design/base-components/Autoresize";
import { Blur } from "~/components/Blur";
import { ImageProps } from "next/image";
import { rest, startCase } from "lodash-es";
import { useComponentContext } from "../contexts/ComponentContext";
import { AnimatedDiv } from "~/components/AnimatedDiv";
import { iconsMap } from "~/modules/icons-map";

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

const getIcon = (inputString: string) => {
  const inputLower = inputString.toLowerCase();

  // First, check for exact matches
  for (let i = 0; i < iconsMap.length; i++) {
    const iconEntry = iconsMap[i];
    if (
      iconEntry?.exact &&
      iconEntry.exact.map((e) => e.toLowerCase()).includes(inputLower)
    ) {
      return iconEntry.icon;
    }
  }

  // If no exact match is found, then check for partial matches
  for (let i = 0; i < iconsMap.length; i++) {
    const iconEntry = iconsMap[i];
    if (iconEntry?.partial) {
      for (let partialString of iconEntry.partial) {
        if (inputLower.includes(partialString.toLowerCase())) {
          return iconEntry.icon;
        }
      }
    }
  }

  // Return null if no match is found
  return null;
};

const BlurIcon = (props: ImageProps & { imageSize?: number }) => {
  const {
    src,
    imageSize,
    height = imageSize ?? 15,
    width = imageSize ?? 15,
    alt,
    className,
  } = props;
  const Icon = getIcon(src as string);

  const pps = { height, width, alt, className };

  const icon = Icon ? <Icon {...pps} /> : <img {...pps} src={src as string} />;

  return <Blur element={icon} />;
};

const Icon = (props: IconProps) => {
  const { image, imageProps, imageSize } = props;
  const [filter, setFilter] = useState("");

  const filteredIcons = iconsMap.filter((iconEntry) => {
    const searchString = filter.trim().toUpperCase();
    return (
      (iconEntry.exact &&
        iconEntry.exact.some((exactMatch) =>
          exactMatch.toUpperCase().includes(searchString)
        )) ||
      (iconEntry.partial &&
        iconEntry.partial.some((partialMatch) =>
          partialMatch.toUpperCase().includes(searchString)
        ))
    );
  });

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
      {filteredIcons.map((iconEntry, index) => {
        const label = iconEntry.exact
          ? iconEntry.exact[0]
          : iconEntry.partial
          ? iconEntry.partial[0]
          : "";
        return (
          <MenuItem
            key={index}
            className="flex items-center gap-4 first-letter:capitalize hover:bg-transparent"
            // onClick={() => onImageChange(label)}
          >
            <BlurIcon
              {...rest}
              {...(imageProps as { alt: string })}
              src={label!}
            />
            {startCase(label)}
          </MenuItem>
        );
      })}
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
