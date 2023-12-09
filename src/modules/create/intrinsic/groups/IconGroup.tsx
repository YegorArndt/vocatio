import { useState } from "react";
import cn from "classnames";
import {
  FocusableItem,
  Menu,
  MenuButton,
  MenuHeader,
  MenuItem,
} from "@szhsin/react-menu";
import { IoCloudUploadOutline } from "react-icons/io5";

import { Autoresize } from "~/modules/create/intrinsic/Autoresize";
import {
  Email,
  Phone,
  Website,
  Location,
  Linkedin,
  Github,
  Twitter,
  Vk,
  X,
} from "~/components/icons";
import { typedKeys } from "~/modules/draft/utils/common";
import { Blur } from "~/components/Blur";
import { ImageProps } from "next/image";
import { SharedGroupProps } from "./types";
import Image from "next/image";

const icons = {
  email: Email,
  phone: Phone,
  location: Location,
  website: Website,
  linkedin: Linkedin,
  github: Github,
  twitter: Twitter,
  vk: Vk,
  x: X,
  upload: IoCloudUploadOutline,
};

const BlurIcon = (props: ImageProps) => {
  const { src, height = 20, width = 20, alt, className } = props;
  const Icon = icons[src] || Image;
  const icon = (
    <Icon
      src={src}
      height={height}
      width={width}
      className={className}
      draggable={false}
    />
  );

  return <Blur element={icon} />;
};

export const IconGroup = (props: SharedGroupProps) => {
  const {
    value,
    smallTextClassName,
    smallText,
    className,
    id,
    image,
    imageProps,
    ...rest
  } = props;
  const [filter, setFilter] = useState("");

  return (
    <div className={className} {...rest}>
      <Menu
        menuButton={
          <MenuButton>
            <BlurIcon src={image} {...imageProps} />
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
            >
              <BlurIcon {...rest} src={i} />
              {i}
            </MenuItem>
          ))}
      </Menu>
      <div className="flex flex-col">
        <Autoresize value={value} />
        {smallText && (
          <small className={smallTextClassName}>
            <Autoresize value={smallText} />
          </small>
        )}
      </div>
    </div>
  );
};
