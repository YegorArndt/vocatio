import { FocusableItem, MenuButton, MenuDivider } from "@szhsin/react-menu";
import { CustomMenu } from "~/components/ui/external/CustomMenu";
import { useDesignContext } from "../design/contexts/DesignContext";
import { cn } from "~/utils";
import { getFont, stripHtmlTags, typedEntries } from "~/modules/utils";
import { CustomMenuItem } from "~/components/ui/external/CustomMenuItem";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/external/Tooltip";
import { NAV_BUTTON_CN } from "./constants";
import { useState } from "react";
import { fonts } from "../design/types";
import { CvContextManager } from "~/modules/CvContextManager";

export const FontFamilyButton = () => {
  const { design, changeDesign } = useDesignContext();
  const [filter, setFilter] = useState("");

  return (
    <CustomMenu
      menuButton={
        <MenuButton
          className={cn(NAV_BUTTON_CN, "gap-2", getFont(design.font))}
        >
          <span className="text-lg clr-blue">Ag</span>
          {fonts[design.font].name}
        </MenuButton>
      }
      menuClassName="flex flex-col"
    >
      <FocusableItem>
        {({ ref }) => (
          <input
            ref={ref}
            type="text"
            placeholder="Type to search fonts"
            value={filter}
            className="bg-transparent p-2 focus:outline-none"
            onChange={(e) => setFilter(e.target.value)}
            autoFocus
          />
        )}
      </FocusableItem>
      <MenuDivider />
      <TooltipProvider>
        {typedEntries(fonts)
          .filter(([_, v]) =>
            v.name.toLowerCase().includes(filter.toLowerCase())
          )
          .map(([k, v]) => (
            <Tooltip key={v.name}>
              <TooltipTrigger
                onClick={() => changeDesign({ ...design, font: k })}
              >
                <CustomMenuItem>{v.name}</CustomMenuItem>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                className={cn("max-w-[450px] leading-8", getFont(k))}
              >
                <h3 className="border-bottom my-2 gap-2 text-lg first-letter:capitalize">
                  {v.name} font
                </h3>
                <div className="text-md">
                  {typeof window !== "undefined" &&
                    stripHtmlTags(
                      CvContextManager.getInstance().getCv()?.summary || ""
                    )}
                </div>
              </TooltipContent>
            </Tooltip>
          ))}
      </TooltipProvider>
    </CustomMenu>
  );
};
