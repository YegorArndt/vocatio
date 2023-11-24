import { type PropsWithChildren, useEffect, useState } from "react";
import ReactDOM from "react-dom";

export const Portal = (props: PropsWithChildren<Record<string, unknown>>) => {
  const [container] = useState(document.createElement("div"));

  useEffect(() => {
    document.body.appendChild(container);
    return () => {
      document.body.removeChild(container);
    };
  }, [container]);

  return ReactDOM.createPortal(props.children, container);
};
