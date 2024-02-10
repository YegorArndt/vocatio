import { toast } from "sonner";
import { usePersistentData } from "~/hooks/usePersistentData";
import { typedEntries } from "~/modules/utils";
import { BlurImage } from "./BlurImage";
import { Badge } from "./ui/external/Badge";
import {
  TooltipTrigger,
  TooltipContent,
  Tooltip,
  TooltipProvider,
} from "~/components/ui/external/Tooltip";
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
} from "~/components/ui/external/MenuBar";
import { Models } from "~/modules/create/design/extension/types";

type AiPickerProps = {
  onModelChange: (model: Models) => void;
};

const models: Record<
  Models,
  {
    icon: JSX.Element;
    badge: string;
  }
> = {
  "gpt-4": {
    icon: <BlurImage src="/ai/gpt-4.png" className="rounded-full" />,
    badge: "most capable",
  },
  "gpt-3.5": {
    icon: <BlurImage src="/ai/gpt-3.png" className="rounded-full" />,
    badge: "default",
  },
  mixtral: {
    icon: <BlurImage src="/ai/mistral.png" />,
    badge: "fastest",
  },
};

export const AiPicker = (props: AiPickerProps) => {
  const { onModelChange } = props;
  const { ls } = usePersistentData();

  return (
    <Menubar className="clr-card bg-card">
      <MenubarMenu>
        <MenubarTrigger className="flex-y cursor-pointer gap-2">
          {models[ls.defaultModel].icon}
          {ls.defaultModel}
        </MenubarTrigger>
        <MenubarContent className="bg-primary">
          {typedEntries(models).map(([key, value]) =>
            key === "gpt-4" ? (
              <TooltipProvider key={key}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <MenubarItem
                      onClick={() => {
                        toast.info("Upgrade to premium to use gpt-4");
                      }}
                      className="flex-y cursor-pointer gap-2 hover:bg-hover"
                    >
                      {value.icon}
                      {key}
                      <Badge variant="outline">{value.badge}</Badge>
                      <BlurImage src="/premium.png" />
                    </MenubarItem>
                  </TooltipTrigger>
                  <TooltipContent>Premium feature</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <MenubarItem
                key={key}
                className="flex-y cursor-pointer gap-2 hover:bg-hover"
                onClick={() => {
                  onModelChange(key);
                }}
              >
                {value.icon}
                {key}
                <Badge variant="outline">{value.badge}</Badge>
              </MenubarItem>
            )
          )}
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
};
