import cn from "classnames";

import {
  Autoresize,
  type AutoresizeProps,
} from "~/modules/create/components/Autoresize";
import { ComponentValue } from "~/modules/draft/types/components";
import {
  Email,
  Phone,
  Website,
  Location,
  Linkedin,
  Github,
} from "~/components/icons";
import { useEffect, useState } from "react";
import {
  FocusableItem,
  Menu,
  MenuButton,
  MenuHeader,
  MenuItem,
} from "@szhsin/react-menu";
import { typedKeys } from "~/modules/draft/utils/common";
import { useComponentContext } from "../ComponentContext";
import { useDraftContext } from "~/modules/draft/DraftContext";
import { capitalize } from "lodash-es";

export type IconGroupProps = BlurIconProps & {
  label?: string;
  iconClassName?: string;
  value: ComponentValue;
} & AutoresizeProps;

export type BlurIconProps = {
  img?: string;
  height?: number;
  width?: number;
  className?: string;
};

const icons = {
  email: Email,
  phone: Phone,
  location: Location,
  website: Website,
  linkedin: Linkedin,
  github: Github,
};

const BlurIcon = (props: BlurIconProps) => {
  const { img, height, width, className, ...rest } = props;
  const Icon = icons[img as keyof typeof icons] || icons.email;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => setIsLoading(false), []);

  // useEffect(() => {
  //   if (img) localStorage.setItem(imgId, img);
  // }, [img]);

  return (
    <div className={cn("bg-gray-200 !inline-block overflow-hidden")}>
      <Icon
        height={height}
        width={width}
        className={cn(
          className,
          "duration-700 ease-in-out group-hover:opacity-75",
          isLoading
            ? "scale-110 blur-2xl grayscale"
            : "scale-100 blur-0 grayscale-0"
        )}
      />
    </div>
  );
};

const setImgToLs = (id: string, img: string) => {
  localStorage.setItem(id, img);
  return img;
};

export const IconGroup = (props: IconGroupProps) => {
  const { id, value, className, iconClassName, ...rest } = props;

  const imgId = `${id}-img`;

  const [img, setImg] = useState(
    localStorage.getItem(imgId) || setImgToLs(imgId, rest.img!)
  );

  const [filter, setFilter] = useState("");

  const c = useComponentContext();
  const { design } = useDraftContext();

  const sectionsClassName = design?.sections[c.sectionId]?.className || "";

  const sectionBg = sectionsClassName.split(" ").find((i) => i.includes("bg-"));

  const sectionTextColor = sectionsClassName
    .split(" ")
    .find((i) => i.includes("text-"));

  return (
    <div className={cn(className)} {...rest}>
      <Menu
        menuButton={
          <MenuButton>
            <BlurIcon className={iconClassName} {...rest} img={img} />
          </MenuButton>
        }
        direction="left"
        gap={25}
        transition
        className={sectionBg}
        position="initial"
        menuClassName={cn(sectionBg, sectionTextColor)}
      >
        <MenuHeader className={cn(sectionTextColor)}>Change to</MenuHeader>
        <FocusableItem className="mb-2">
          {({ ref }) => (
            <input
              ref={ref}
              type="text"
              placeholder="Type to filter"
              value={filter}
              className="border-gray-300 focus:border-gray-500 w-full border-b bg-transparent p-2 focus:outline-none"
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
              className="flex items-center gap-4 hover:bg-transparent"
              onClick={() => {
                localStorage.setItem(imgId, i);
                setImg(i);
              }}
            >
              <BlurIcon className={iconClassName} {...rest} img={i} />
              {capitalize(i)}
            </MenuItem>
          ))}
      </Menu>
      <Autoresize id={id} value={value} />
    </div>
  );
};
