import { useCrudContext } from "../../baseComponents/dnd/crud";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "~/components/ui/external/Popover";
import { BsPlusCircleDotted } from "react-icons/bs";
import { cn } from "~/utils";
import { BUTTON_CN } from "../constants";
import { useDesignContext } from "../../contexts/DesignContext";
import { typedEntries } from "~/modules/utils";
import { useComponentContext } from "../../contexts/ComponentContext";
import { BlurImage } from "~/components";
import { useCurrentDraft } from "~/hooks/useCurrentDraft";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/external/Tooltip";
import { GeneratedDraft, RouterUser } from "~/modules/init-gen/types";
import { BaseComponentType, Design } from "../../types";
import { usePersistentData } from "~/hooks/usePersistentData";

const { log } = console;

const NOT_IMPLEMENTED_COMPONENTS = [
  "contact",
  "education",
  "experience",
  "skills",
  "languages",
];

const mapping = {
  "heading-1": {
    path: "/base-components/heading-1.png",
    name: "Heading 1",
  },
  "heading-2": {
    path: "/base-components/heading-2.png",
    name: "Heading 2",
  },
  "heading-3": {
    path: "/base-components/heading-3.png",
    name: "Heading 3",
  },
  text: {
    path: "/base-components/text.png",
    name: "Text",
  },
  group: {
    path: "/base-components/group.png",
    name: "Group",
  },
  professionalSummary: {
    path: "/base-components/professional-summary.png",
    name: "Professional Summary",
  },
  userImage: {
    path: "/base-components/user-image.png",
    name: "Image",
  },
};

const getTooltipContent = (
  type: BaseComponentType,
  draft: GeneratedDraft,
  user: RouterUser,
  design: Design
) => {
  if (type === "userImage")
    return (
      <BlurImage
        src={user?.image}
        {...design.baseComponents.userImage}
        height={140}
        width={140}
      />
    );
  if (type === "professionalSummary")
    return (
      <div
        className="max-w-[300px] text-sm"
        dangerouslySetInnerHTML={{ __html: draft.generatedProfessionalSummary }}
      />
    );

  return <div {...design.baseComponents[type]}>{user.jobTitle}</div>;
};

export const AddComponentPopover = () => {
  const c = useComponentContext();
  const { addComponent } = useCrudContext();
  const { design } = useDesignContext();
  const { currentDraft } = useCurrentDraft();
  const { ls } = usePersistentData();

  return (
    <Popover>
      <PopoverTrigger className={cn(BUTTON_CN, "gap-2 p-2")}>
        <BsPlusCircleDotted /> Add below
      </PopoverTrigger>
      <PopoverContent
        onClick={(e) => {
          e.stopPropagation();
        }}
        side="top"
        className="flex flex-col gap-2 overflow-auto !bg-card !px-0"
      >
        <TooltipProvider>
          {typedEntries(design.baseComponents).map(
            ([type, props]) =>
              !NOT_IMPLEMENTED_COMPONENTS.includes(type) && (
                <Tooltip key={type}>
                  <TooltipTrigger
                    className="flex-y lg gap-3 hover:bg-hover"
                    onClick={() =>
                      addComponent({
                        props: { ...props },
                        type,
                        id: c.id,
                        sectionId: c.sectionId,
                      })
                    }
                  >
                    <BlurImage
                      src={mapping?.[type as keyof typeof mapping].path}
                      width={40}
                    />
                    {mapping?.[type as keyof typeof mapping].name}
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    {currentDraft &&
                      ls.user &&
                      getTooltipContent(type, currentDraft, ls.user, design)}
                  </TooltipContent>
                </Tooltip>
              )
          )}
        </TooltipProvider>
      </PopoverContent>
    </Popover>
  );
};
