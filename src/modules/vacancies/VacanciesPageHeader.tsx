import { FocusableItem, MenuDivider, MenuHeader } from "@szhsin/react-menu";
import { get } from "lodash-es";
import { HiOutlinePlusCircle, HiPlusCircle } from "react-icons/hi2";
import { CustomMenu } from "~/components/ui/external/CustomMenu";
import { CustomMenuButton } from "~/components/ui/external/CustomMenuButton";
import { Button, ButtonProps } from "~/components/ui/buttons/Button";
import { cn } from "~/utils";
import { GroupedVacancies, useVacanciesContext } from "./VacanciesContext";
import { CustomMenuItem } from "~/components/ui/external/CustomMenuItem";
import { Text } from "~/components/ui/inputs/Text";
import { useForm } from "react-hook-form";
import { ReactNode } from "react";
import { defaultGroups } from "./constants";
import { SkeletonButtonStack } from "~/components/Spinner";
import { Diamond } from "~/components/icons";
import { typedKeys } from "../utils";
import { NewVacancyDrawer } from "./NewVacancyDrawer";

const { log } = console;

type Group = GroupedVacancies[keyof GroupedVacancies];

const HEADER_BUTTON_CN =
  "sm clr-ghost font-medium flex-y relative rounded-md last:-ml-2 hover:main-hover hover:text-weiss common whitespace-nowrap";

const HEADER_BUTTON_AFTER =
  "after:absolute after:-bottom-2 after:left-0 after:h-[2px] after:w-full after:bg-weiss";

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
        "!text-weiss": isActive,
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
    setCurrentGroup,
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
    <header className="flex-between border-bottom sticky top-0 z-layout bg-primary py-2">
      <section className="flex-y w-full gap-3">
        {loadingVacancies && <SkeletonButtonStack length={2} />}
        {typedKeys(groupedVacancies).map((groupName) => {
          return (
            <GroupButton
              key={groupName}
              group={groupedVacancies[groupName]!}
              onClick={() => setCurrentGroup(groupName)}
              isActive={groupName === currentGroup}
              endIcon={
                <span className="ml-1">
                  ({groupedVacancies[groupName]?.vacancies.length})
                </span>
              }
            />
          );
        })}
        {!loadingVacancies && (
          <CustomMenu
            gap={10}
            menuButton={
              <CustomMenuButton className="flex-y sm clr-ghost hover:main-hover gap-2 rounded-md">
                <HiPlusCircle size={17} />
                New group
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
                {g}
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
                    className="outlined !border-none"
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
        )}
        <NewVacancyDrawer />
      </section>
    </header>
  );
};
