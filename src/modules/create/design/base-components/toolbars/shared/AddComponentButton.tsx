import { useCrudContext } from "../../dnd/crud";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "~/components/ui/external/Popover";
import { api, cn } from "~/utils";
import { BUTTON_CN } from "../constants";
import { useDesignContext } from "../../../contexts/DesignContext";
import { typedEntries } from "~/modules/utils";
import { useComponentContext } from "../../../contexts/ComponentContext";
import { BlurImage } from "~/components";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/external/Tooltip";
import { BaseComponentType, Design } from "../../../types";
import { RouterUser } from "~/modules/types";
import { Gen } from "~/modules/init-gen/types";
import { useCvContext } from "~/hooks/useCvContext";
import { HiPlusCircle } from "react-icons/hi2";

const { log } = console;

const NOT_IMPLEMENTED_COMPONENTS = [
  "contact",
  "education",
  "experience",
  "skills",
  "languages",
  "entry",
];

// TODO jobTitle WHENEVER a new cmp is added it breaks

const mapping = {
  userName: {
    path: "/base-components/heading-1.png",
    name: "Name",
  },
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
  bullet: {
    path: "/base-components/text.png",
    name: "Bullet point text",
  },
};

const getTooltipContent = (
  type: BaseComponentType,
  gen: Gen,
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
        dangerouslySetInnerHTML={{ __html: gen.professionalSummary }}
      />
    );

  return <div {...design.baseComponents[type]}>{user.jobTitle}</div>;
};

export const AddComponentPopover = () => {
  const c = useComponentContext();
  const { addComponent } = useCrudContext();
  const { design } = useDesignContext();
  const { data: user } = api.users.get.useQuery();

  const { gen } = useCvContext() || {};

  return (
    <Popover>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger className={cn(BUTTON_CN, "gap-2 p-2")}>
            <HiPlusCircle fontSize={19} />
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent>Add below</TooltipContent>
      </Tooltip>
      <PopoverContent
        onClick={(e) => e.stopPropagation()}
        side="top"
        className="flex flex-col gap-2 overflow-auto !bg-card !px-0"
      >
        {typedEntries(design.baseComponents).map(
          ([type, props]) =>
            !NOT_IMPLEMENTED_COMPONENTS.includes(type) && (
              <Tooltip key={type}>
                <TooltipTrigger
                  className="flex-y lg hover:main-hover gap-3"
                  onClick={() =>
                    addComponent({
                      props: { ...props, value: "Sample text" },
                      type,
                      sectionId: c.sectionId,
                      id: c.id,
                    })
                  }
                >
                  <BlurImage
                    src={mapping?.[type as keyof typeof mapping].path}
                    width={40}
                  />
                  {mapping?.[type as keyof typeof mapping]?.name}
                </TooltipTrigger>
                <TooltipContent side="left">
                  {gen && user && getTooltipContent(type, gen, user, design)}
                </TooltipContent>
              </Tooltip>
            )
        )}
      </PopoverContent>
    </Popover>
  );
};
