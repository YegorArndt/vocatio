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

export type IconGroupProps = {
  img?: string;
  height?: number;
  width?: number;
  label?: string;
  iconClassName?: string;
  value: ComponentValue;
} & AutoresizeProps;

const icons = {
  email: Email,
  phone: Phone,
  location: Location,
  website: Website,
  linkedin: Linkedin,
  github: Github,
};

export const IconGroup = (props: IconGroupProps) => {
  const {
    id,
    img = "email",
    value,
    height,
    width,
    className,
    iconClassName,
    ...rest
  } = props;
  const [isLoading, setIsLoading] = useState(true);

  const imgId = `${id}-img`;

  const Icon = icons[img];

  useEffect(() => {
    setIsLoading(false);
  }, []);

  // useEffect(() => {
  //   if (img) localStorage.setItem(imgId, img);
  // }, [img]);

  return (
    <div className={cn(className)} {...rest}>
      <div className={cn("bg-gray-200 !inline-block overflow-hidden")}>
        <Icon
          id={imgId}
          height={height}
          width={width}
          className={cn(
            iconClassName,
            "duration-700 ease-in-out group-hover:opacity-75",
            isLoading
              ? "scale-110 blur-2xl grayscale"
              : "scale-100 blur-0 grayscale-0"
          )}
        />
      </div>
      <Autoresize id={id} value={value} />
      {/* <Tooltip
        id={id}
        place="left"
        opacity={1}
        offset={-15}
        style={{ paddingInline: 10, zIndex: 9999 }}
        clickable
        delayShow={400}
        delayHide={600}
        render={() => <div>kek</div>}
      /> */}
    </div>
  );
};
