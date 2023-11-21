import cn from "classnames";
import { type HTMLAttributes } from "react";

import { Autoresize } from "../Autoresize";

type DecoratedProps = {
  date: {
    id: string;
    value: string;
  };
  place: {
    id: string;
    value: string;
  };
  title: {
    id: string;
    value: string;
  };
  story: {
    id: string;
    value: string;
  };
} & HTMLAttributes<HTMLDivElement>;

export const Decorated = (props: DecoratedProps) => {
  const {
    date: { id: dateId, value: date },
    place: { id: placeId, value: place },
    title: { id: titleId, value: title },
    story: { id: storyId, value: story },
    className,
    ...rest
  } = props;

  return (
    <div
      className={cn("relative flex flex-col gap-1 pb-4 first:mt-4", className)}
      {...rest}
    >
      <div className="absolute left-0 top-2 z-1 h-3 w-3 rounded-full border-2 border-solid border-black bg-white" />
      <div className="absolute left-[.36rem] top-2 h-full w-[0.5px] bg-black" />
      <Autoresize id={dateId} className="text-[1rem] font-bold" value={date} />
      <Autoresize
        id={placeId}
        className="text-[1rem] font-bold"
        value={place}
      />
      <Autoresize id={title} className="italic" value={titleId} />
      <Autoresize id={storyId} value={story} className="pl-6" />
    </div>
  );
};
