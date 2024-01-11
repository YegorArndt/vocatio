import { FocusableItem, MenuDivider, MenuHeader } from "@szhsin/react-menu";
import { get, startCase } from "lodash-es";
import { HiOutlinePlusCircle } from "react-icons/hi2";
import { CustomMenu } from "~/components/external/CustomMenu";
import { CustomMenuButton } from "~/components/external/CustomMenuButton";
import { Button, ButtonProps } from "~/components/ui/buttons/Button";
import { cn } from "~/utils";
import { GroupedVacancies, useVacanciesContext } from "./VacanciesContext";
import { typedKeys } from "../draft/utils/common";
import { CustomMenuItem } from "~/components/external/CustomMenuItem";
import { Diamond } from "~/icons";
import { Text } from "~/components/ui/inputs/Text";
import { useForm } from "react-hook-form";
import { ReactNode } from "react";

type Group = GroupedVacancies[keyof GroupedVacancies];

const defaultGroups = {
  favorite: {
    icon: <span>😻</span>,
    label: "Favorite",
  },
  applied: {
    icon: <span>✅</span>,
    label: "Applied",
  },
  interview: {
    icon: <span>🎥</span>,
    label: "Interview",
  },
  rejected: {
    icon: <span>😿</span>,
    label: "Rejected",
  },
  offer: {
    icon: <span>🎉</span>,
    label: "Offer",
  },
};

const HEADER_BUTTON_CN =
  "sm clr-card flex-y relative rounded-md last:-ml-2 hover:bg-hover whitespace-nowrap";

const HEADER_BUTTON_AFTER =
  "after:absolute after:-bottom-2 after:left-0 after:h-[0.5px] after:w-full after:bg-white";

const getSuggestedGroupNames = (gropedVacancies: GroupedVacancies) => {
  const alreadyExisting = typedKeys(gropedVacancies);

  return typedKeys(defaultGroups).filter(
    (suggestedGroup) =>
      !alreadyExisting.map((g) => g.toLowerCase()).includes(suggestedGroup)
  );
};

const GroupButton = (
  props: ButtonProps & {
    group: Group;
    isActive: boolean;
  }
) => {
  const { isActive, group, ...rest } = props;

  const text = group.label;
  // TODO: mess
  const defaultIcon = get(defaultGroups, `${text}.icon`, <Diamond />);
  const icon = get(group, "icon", defaultIcon);

  return (
    <Button
      {...rest}
      text={text}
      frontIcon={icon}
      baseCn={HEADER_BUTTON_CN}
      className={cn({
        [HEADER_BUTTON_AFTER]: isActive,
      })}
    />
  );
};

export const VacanciesPageHeader = () => {
  const {
    groupedVacancies,
    setGroupedVacancies,
    loadingVacancies,
    currentGroup,
    isDndMode,
    setCurrentGroup,
    setIsDndMode,
  } = useVacanciesContext();

  const { control, watch } = useForm();

  const addNewGroup = (groupName: string, label: string, icon?: ReactNode) => {
    setGroupedVacancies((prev) => {
      const newGroup = {
        [groupName]: {
          label: label,
          icon: icon ?? <Diamond />,
          vacancies: [],
        },
      };

      return { ...prev, ...newGroup } as GroupedVacancies;
    });
  };

  const suggestedGroupNames = getSuggestedGroupNames(groupedVacancies);

  return (
    <header className="flex-between border-bottom sticky top-5 z-layout bg-primary pb-2 before:absolute before:-top-16 before:left-0 before:h-16 before:w-full before:bg-primary">
      <section className="flex-y gap-3">
        {typedKeys(groupedVacancies).map((groupName) => (
          <GroupButton
            key={groupName}
            group={groupedVacancies[groupName] as Group}
            onClick={() => setCurrentGroup(groupName)}
            isActive={groupName === currentGroup}
            endIcon={
              <span className="ml-1">
                ({groupedVacancies[groupName]?.vacancies.length})
              </span>
            }
          />
        ))}
        <CustomMenu
          gap={10}
          menuButton={
            <CustomMenuButton className="flex-y sm gap-2 rounded-md hover:bg-hover">
              <HiOutlinePlusCircle />
              Add a new group
            </CustomMenuButton>
          }
        >
          {suggestedGroupNames.map((g) => (
            <CustomMenuItem
              key={g}
              onClickCapture={() =>
                addNewGroup(g, defaultGroups[g].label, defaultGroups[g].icon)
              }
              className="flex-y gap-2"
            >
              {defaultGroups[g].icon}
              {startCase(g)}
            </CustomMenuItem>
          ))}
          {!!suggestedGroupNames.length && <MenuDivider />}
          <MenuHeader className="normal-case">Custom</MenuHeader>
          <FocusableItem>
            {({ ref }) => (
              <div ref={ref} className="flex-y gap-2">
                <Text
                  name="newGroup"
                  control={control}
                  className="outlined !border-none [&>*]:text-black"
                  placeholder="Type a new group name"
                />
                <Button
                  onClick={() => {
                    const userDefinedGroup = watch("newGroup");
                    if (!userDefinedGroup) return;
                    addNewGroup(userDefinedGroup, userDefinedGroup);
                  }}
                >
                  <HiOutlinePlusCircle size={17} />
                </Button>
              </div>
            )}
          </FocusableItem>
        </CustomMenu>
      </section>
      {/* <TooltipProvider>
        <Tooltip>
          <TooltipTrigger
            className={cn(HEADER_BUTTON_CN, {
              "bg-hover": isDndMode,
            })}
            onClick={() => setIsDndMode(!isDndMode)}
            disabled
          >
            Drag and drop mode
          </TooltipTrigger>
          <TooltipContent>✨ Coming soon</TooltipContent>
        </Tooltip>
      </TooltipProvider> */}
    </header>
  );
};
