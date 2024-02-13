import { toast } from "sonner";
import { getModelUi, aiModels, typedEntries } from "~/modules/utils";
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
import { api } from "~/utils";
import { DefaultModel } from "@prisma/client";

type AiPickerProps = {
  onModelChange: (model: DefaultModel) => void;
};

export const AiPicker = (props: AiPickerProps) => {
  const { onModelChange } = props;
  const { data: user } = api.users.get.useQuery();

  const { defaultModel } = user || {};

  const { imageSrc, badge, name } = getModelUi(defaultModel);

  return (
    <Menubar className="clr-card bg-card">
      <MenubarMenu>
        <MenubarTrigger className="flex-y cursor-pointer gap-2">
          <BlurImage src={imageSrc} className="rounded-full" />
          {name}
          <Badge variant="outline">{badge}</Badge>
        </MenubarTrigger>
        <MenubarContent className="bg-primary">
          {typedEntries(aiModels).map(([key, value]) =>
            key === DefaultModel.GPT_4 ? (
              <TooltipProvider key={key}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <MenubarItem
                      onClick={() => {
                        toast.info("Upgrade to premium to use gpt-4");
                      }}
                      className="flex-y cursor-pointer gap-2 hover:bg-hover"
                    >
                      <BlurImage
                        src={value.imageSrc}
                        className="rounded-full"
                      />
                      {value.name}
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
                <BlurImage src={value.imageSrc} className="rounded-full" />
                {value.name}
                <Badge variant="outline">{value.badge}</Badge>
              </MenubarItem>
            )
          )}
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
};
