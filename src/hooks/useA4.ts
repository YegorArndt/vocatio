import { useState, useRef, useEffect } from "react";
import { A4_HEIGHT } from "~/modules/create/design/constants";

const { log } = console;

export const useA4 = () => {
  const [pages, setPages] = useState(1);
  const a4Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Function to calculate and set pages
    const calculatePages = () => {
      if (a4Ref.current) {
        const pageCount = Math.ceil(a4Ref.current.scrollHeight / A4_HEIGHT);
        setPages(pageCount);
      }
    };

    let observer: MutationObserver;

    // Delay setup of MutationObserver by 5 seconds
    const timer = setTimeout(() => {
      if (a4Ref.current) {
        observer = new MutationObserver(calculatePages);

        observer.observe(a4Ref.current, { childList: true, subtree: true });

        // Initial calculation
        calculatePages();
      }
    }, 5000);

    // Cleanup function
    return () => {
      clearTimeout(timer);
      if (observer) {
        observer.disconnect();
      }
    };
  }, []); // Empty dependencies array ensures this runs once after initial render

  return { a4Ref, pages, setPages };
};
