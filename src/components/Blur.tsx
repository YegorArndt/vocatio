import cn from "classnames";
import { useState, useEffect, cloneElement, ReactElement } from "react";

type BlurProps = {
  className?: string;
  element: ReactElement;
} & JSX.IntrinsicElements["div"];

const loading = "scale-110 blur-2xl grayscale";
const notLoading = "scale-100 blur-0 grayscale-0";
const base = "duration-700 ease-in-out group-hover:opacity-75";

/**
 * Make any element blurred when it's first rendered.
 */
export const Blur = (props: BlurProps) => {
  const { element, className, ...rest } = props;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false));

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={cn("bg-gray-200 inline-block overflow-hidden", className)}>
      {cloneElement(element, {
        ...rest,
        ...element.props,
        className: cn(
          base,
          element?.props?.className,
          isLoading ? loading : notLoading
        ),
      })}
    </div>
  );
};
