import { type CSSProperties, useState, useMemo, useEffect } from "react";
import cn from "classnames";

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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/external/Popover";
import { Button } from "~/components/ui/buttons/Button";
import { stripHtmlTags } from "~/modules/utils";

const { log } = console;

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

type IconProps = Pick<GroupProps, "image" | "imageProps" | "imageSize"> & {
  setImage: (newImage: string) => void;
  value: string;
};

const getIcon = (inputString: string) => {
  const inputLower = inputString.toLowerCase();
  return (
    iconsMap.find(
      (iconEntry) =>
        (iconEntry.exact &&
          iconEntry.exact.some((e) => e.toLowerCase() === inputLower)) ||
        (iconEntry.partial &&
          iconEntry.partial.some((partial) =>
            inputLower.includes(partial.toLowerCase())
          ))
    )?.icon || null
  );
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

  return <Blur className="-mb-[0.1em]" element={icon} />;
};

const useFilteredIcons = (filter: string) => {
  return useMemo(() => {
    const searchString = filter.trim().toUpperCase();
    return iconsMap.filter(
      (iconEntry) =>
        (iconEntry.exact &&
          iconEntry.exact.some((match) =>
            match.toUpperCase().includes(searchString)
          )) ||
        (iconEntry.partial &&
          iconEntry.partial.some((match) =>
            match.toUpperCase().includes(searchString)
          ))
    );
  }, [filter]);
};

const Icon = (props: IconProps) => {
  const { image, imageProps, imageSize, setImage, value } = props;
  const [filter, setFilter] = useState("");

  const filteredIcons = useFilteredIcons(filter);

  return (
    <Popover>
      <PopoverTrigger>
        <BlurIcon
          src={image}
          imageSize={imageSize}
          {...(imageProps as { alt: string })}
        />
      </PopoverTrigger>
      <PopoverContent
        side="left"
        sideOffset={130}
        className="flex h-[500px] min-w-[400px] flex-col gap-5 !bg-card"
      >
        <input
          type="text"
          placeholder="Type to filter"
          value={filter}
          className={cn(
            "border-gray-300 focus:border-gray-500 w-full border-b bg-transparent p-2 text-md focus:outline-none"
          )}
          onChange={(e) => setFilter(e.target.value)}
        />
        <p className="leading-8 h4">
          You&apos;re choosing an icon for &quot;{stripHtmlTags(value).trim()}
          &quot;
        </p>
        <section className="flex-y flex-wrap gap-3 overflow-auto">
          {filteredIcons.map((iconEntry, index) => {
            const label = iconEntry.exact
              ? iconEntry.exact[0]
              : iconEntry.partial
              ? iconEntry.partial[0]
              : "";
            return (
              <Button
                key={index}
                className="flex-y gap-2 rounded-md bg-primary px-3 py-2 !text-md hover:bg-weiss hover:text-schwarz"
                onClick={() => {
                  const newImage =
                    iconEntry.exact?.[0] || iconEntry.partial?.[0];
                  if (!newImage) return;
                  setImage(newImage);
                }}
              >
                <BlurIcon
                  {...rest}
                  {...(imageProps as { alt: string })}
                  src={label!}
                />
                {startCase(label)}
              </Button>
            );
          })}
        </section>
      </PopoverContent>
    </Popover>
  );
};

export const Group = () => {
  const { type: initialType, hydratedProps = {} } = useComponentContext();
  const {
    containerClassName,
    image,
    imageProps,
    label,
    labelProps,
    value,
    valueProps,
  } = hydratedProps as GroupProps;
  const [currentIcon, setCurrentIcon] = useState(image);
  const [type, setType] = useState(initialType);

  useEffect(() => {
    if (currentIcon === "star") {
      setType("text");
    }
  }, []);

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
      {type === "icon-group" && (
        <Icon
          image={currentIcon}
          setImage={setCurrentIcon}
          imageProps={imageProps}
          value={value}
        />
      )}

      {type === "group" && (
        <Autoresize type="label" value={label} {...labelProps} />
      )}

      <Autoresize value={value} {...valueProps} />
    </AnimatedDiv>
  );
};
