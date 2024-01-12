import { type PropsWithChildren, useEffect, useState } from "react";
import ReactDOM from "react-dom";

export const Portal = (props: PropsWithChildren<Record<string, unknown>>) => {
  const [container, setContainer] = useState(null as unknown as HTMLDivElement);

  useEffect(() => {
    if (container) {
      document.body.appendChild(container);
      return;
    }

    const c = document.createElement("div");
    setContainer(c);
  }, [container]);

  return container ? ReactDOM.createPortal(props.children, container) : null;
};
