import { useEffect, useState } from "react";
import { Progress } from "~/components/ui/external/Progress";
import { cn } from "~/utils";

type ProgressIncrementerProps = {
  canFinish: boolean;
  incrementBy?: number;
  shouldHide?: boolean;
  className?: string;
  fixToTop?: boolean;
};

export const ProgressIncrementer = ({
  canFinish,
  incrementBy = 30,
  shouldHide,
  className,
  fixToTop,
}: ProgressIncrementerProps) => {
  const [progress, setProgress] = useState(5);
  const [hidden, setHidden] = useState(false);

  const incrementProgress = () => {
    // Only increment if progress is less than 90% or canFinish is true
    if (progress < 90 || canFinish) {
      const randomIncrement = Math.floor(Math.random() * incrementBy) + 1; // Random increment between 1 and 5
      setProgress((prevProgress) => {
        // Make sure progress does not exceed 100%
        const updatedProgress =
          prevProgress + randomIncrement > 100
            ? 100
            : prevProgress + randomIncrement;
        return updatedProgress;
      });
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      incrementProgress();
    }, 1000); // Increment every second

    if (canFinish) {
      clearInterval(timer);
      setProgress(100);

      if (shouldHide) {
        setTimeout(() => {
          setHidden(true);
        }, 1000);
      }
    }

    // Cleanup interval on unmount
    return () => clearInterval(timer);
  }, [progress, canFinish]);

  return (
    !hidden &&
    (fixToTop ? (
      <header className="fixed inset-0">
        <Progress
          value={progress}
          className={(cn("fixed inset-0 w-screen shadow-md"), className)}
        />{" "}
      </header>
    ) : (
      <Progress
        value={progress}
        className={(cn("fixed inset-0 w-screen shadow-md"), className)}
      />
    ))
  );
};
