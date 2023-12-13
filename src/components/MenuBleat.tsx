import { PropsWithChildren, useRef } from "react";
import { ControlledMenu, useClick, useMenuState } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import { BlurImage } from "./BlurImage";
import { Button } from "./ui/buttons/Button";

type MenuProps = PropsWithChildren<{}>;

export const MenuBleat = (props: MenuProps) => {
  const { children } = props;
  const ref = useRef(null);
  const [menuState, toggleMenu] = useMenuState({ transition: true });
  const anchorProps = useClick(menuState.state, toggleMenu);

  return (
    <>
      <Button className="flex-center" ref={ref} {...anchorProps}>
        <BlurImage src="/gpt-logo.jpg" height={30} width={30} alt="GPT Logo" />
      </Button>
      <ControlledMenu
        {...menuState}
        anchorRef={ref}
        onClose={() => toggleMenu(false)}
        gap={10}
      >
        {children}
      </ControlledMenu>
    </>
  );
};
