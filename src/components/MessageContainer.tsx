import {
  PropsWithChildren,
  useState,
  useEffect,
  Children,
  ReactElement,
  cloneElement,
} from "react";

export const MessageContainer = (
  props: PropsWithChildren<{ className?: string; duration?: number }>
) => {
  const { children, className } = props;
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const childArray = Children.toArray(children);

    const displayNextMessage = (index: number) => {
      if (index >= childArray.length) return;

      const currentChild = childArray[index] as ReactElement;
      const duration = currentChild.props.duration * 1000;

      const timer = setTimeout(() => {
        setCurrentMessageIndex(index + 1);
        displayNextMessage(index + 1);
      }, duration);

      return timer;
    };

    const timer = displayNextMessage(0);

    // Cleanup function to clear the timer
    return () => clearTimeout(timer);
  }, [children]);

  return (
    <div className={className}>
      {Children.map(
        children,
        (child, index) =>
          index === currentMessageIndex &&
          child !== null &&
          cloneElement(child as ReactElement, {
            key: index,
          })
      )}
    </div>
  );
};
