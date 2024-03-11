import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
} from "~/components/ui/external/MenuBar";
import { api } from "~/utils";
import { Badge } from "./ui/external/Badge";

export const AiPicker = () => {
  const { data: user } = api.users.get.useQuery();

  return (
    <Menubar className="clr-card bg-card">
      <MenubarMenu>
        <MenubarTrigger className="flex-y cursor-pointer gap-2">
          <Badge>Coming soon</Badge>
          {/* <BlurImage src={imageSrc} className="rounded-full" />
          {name}
          <Badge variant="outline">{badge}</Badge> */}
        </MenubarTrigger>
        <MenubarContent className="bg-primary">
          {/* {typedEntries(aiModels).map(([key, value]) =>
            key === DefaultModel.GPT_4 ? (
              <TooltipProvider key={key}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <MenubarItem
                      onClick={() => {
                        toast.info("Upgrade to premium to use gpt-4");
                      }}
                      className="flex-y hover:main-hover cursor-pointer gap-2"
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
                className="flex-y hover:main-hover cursor-pointer gap-2"
                onClick={() => {
                  onModelChange(key);
                }}
              >
                <BlurImage src={value.imageSrc} className="rounded-full" />
                {value.name}
                <Badge variant="outline">{value.badge}</Badge>
              </MenubarItem>
            )
          )} */}
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
};
