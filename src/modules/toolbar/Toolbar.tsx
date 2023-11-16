import { RefObject } from "react";

import { Download } from "./Download";
import { ChangeDesign } from "./ChangeDesign";

type ToolbarProps = {
  a4Ref: RefObject<HTMLDivElement>;
};

export const Toolbar = (props: ToolbarProps) => {
  const { a4Ref } = props;

  return (
    <aside className="toolbar">
      <Download a4Ref={a4Ref} />
      <ChangeDesign />
    </aside>
  );
};
