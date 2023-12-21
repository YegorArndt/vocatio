import { useState } from "react";
import cn from "classnames";
import {
  FocusableItem,
  Menu,
  MenuButton,
  MenuHeader,
  MenuItem,
} from "@szhsin/react-menu";

import { Autoresize } from "~/modules/create/intrinsic/Autoresize";
import { typedKeys } from "~/modules/draft/utils/common";
import { Blur } from "~/components/Blur";
import { ImageProps } from "next/image";
import { SharedGroupProps } from "./types";
import { BlurImage } from "~/components";
import { startCase } from "lodash-es";
import { useDraftContext } from "~/modules/draft/DraftContext";
import { useComponentContext } from "../../ComponentContext";
import { icons } from "~/constants";

const BlurIcon = (props: ImageProps) => {
  let { src, height = 20, width = 20, alt, className } = props;
  const Icon = icons[src as keyof typeof icons];

  const pps = { height, width, alt, className };

  const icon = Icon ? <Icon {...pps} /> : <BlurImage {...pps} src={src} />;

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
    label,
    ...rest
  } = props;

  const [filter, setFilter] = useState("");
  const c = useComponentContext();
  const { updateDesign } = useDraftContext();

  const onImageChange = (key: keyof typeof icons) => {
    const newProps = { ...c.props, image: key };
    c.props = newProps;
    updateDesign();
  };

  return (
    <div className={className} {...rest}>
      {c.type === "icon-group" ? (
        <Menu
          menuButton={
            <MenuButton>
              <BlurIcon src={image} {...(imageProps as { alt: string })} />
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
                onClick={() => onImageChange(i)}
              >
                <BlurIcon
                  {...rest}
                  {...(imageProps as { alt: string })}
                  src={i}
                />
                {startCase(i)}
              </MenuItem>
            ))}
        </Menu>
      ) : (
        <Autoresize type="label" value={label} />
      )}
      <div className="flex flex-col">
        <Autoresize value={value} />
        {smallText && (
          <small className={smallTextClassName}>
            <Autoresize key="smallText" value={smallText} />
          </small>
        )}
      </div>
    </div>
  );
};