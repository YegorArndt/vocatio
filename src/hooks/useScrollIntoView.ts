import { useRef, useEffect } from "react";

export const useScrollIntoView = (props: { shouldScroll: boolean }) => {
  const { shouldScroll } = props;

  const scrollIntoViewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!shouldScroll) return;
    scrollIntoViewRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return scrollIntoViewRef;
};
