import { useRef, useEffect } from "react";
import VanillaTilt from "vanilla-tilt";

export const useGlare = () => {
  const tiltRef = useRef(null);

  useEffect(() => {
    if (!tiltRef.current) return;

    VanillaTilt.init(tiltRef.current, {
      max: 3,
      speed: 100,
      glare: true,
      "max-glare": 0.5,
    });
  }, [tiltRef.current]);

  return tiltRef;
};
