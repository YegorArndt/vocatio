import { BsPlusCircleDotted } from "react-icons/bs";
import { useGeneratedData } from "~/hooks/useGeneratedData";
import { BUTTON_CN } from "../constants";
import { cn } from "~/utils";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "~/components/ui/external/Popover";
import { useMemo, useState } from "react";
import { useComponentContext } from "../../../contexts/ComponentContext";
import { Button } from "~/components/ui/buttons/Button";
import { Gpt } from "~/components/icons";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "~/components/ui/external/Carousel";
import { AddBulletPoint, Events, eventManager } from "~/modules/EventManager";

const { log } = console;

type ActiveTab = 0 | 1;

export const AddBulletPointsPopover = () => {
  const { generated } = useGeneratedData();
  const c = useComponentContext();

  const [activeTab, setActiveTab] = useState<ActiveTab>(0);

  const entry = generated?.generatedExperience?.find((exp) => exp.id === c.id);
  const originalEntry = generated?.experience?.find((exp) => exp.id === c.id);

  const addBullet = (bullet: string) => {
    if (!generated || !entry) return;

    eventManager.emit<AddBulletPoint>(Events.ADD_BULLET_TO_ENTRY_EVENT, {
      bullet,
      entry,
    });
  };

  const bulletPoints = useMemo(() => {
    if (!generated) return [];

    const rawBullets = {
      0: entry?.description,
      1: originalEntry?.description
        ?.split("•")
        .filter((bullet) => bullet.trim()),
    };

    // Split the bullets into groups of 4
    const chunkedBullets = rawBullets[activeTab]?.reduce(
      (resultArray, item, index) => {
        const chunkIndex = Math.floor(index / 4);

        if (!resultArray[chunkIndex]) {
          resultArray[chunkIndex] = []; // start a new chunk
        }

        resultArray[chunkIndex]?.push(item);

        return resultArray;
      },
      [] as string[][]
    );

    return chunkedBullets;
  }, [generated, entry, activeTab]);

  return (
    <Popover>
      <PopoverTrigger className={cn(BUTTON_CN, "gap-2 p-2")}>
        <BsPlusCircleDotted /> Add bullet points
      </PopoverTrigger>
      {generated && (
        <PopoverContent
          onClick={(e) => {
            e.stopPropagation();
          }}
          side="top"
          className="flex w-[600px] flex-col gap-3 !bg-card"
        >
          <header className="grid grid-cols-2">
            {[0, 1].map((i) => (
              <Button
                key={i}
                frontIcon={0 === i ? <Gpt /> : null}
                text={i === 0 ? "Generated" : "Original"}
                onClick={() => setActiveTab(i as ActiveTab)}
                baseCn="flex-center p-3 text-center"
                className={
                  activeTab === i ? "border-bottom clr-primary" : "clr-ghost"
                }
              />
            ))}
          </header>
          <div className="flex flex-col gap-3">
            <Carousel>
              <header className="my-5 grid grid-cols-2">
                <CarouselPrevious
                  text="Back"
                  className="flex-center relative h-auto w-auto gap-2 !bg-transparent"
                />
                <CarouselNext
                  text="View more"
                  className="flex-center relative h-auto w-auto gap-2 !bg-transparent"
                />
              </header>
              <CarouselContent>
                {bulletPoints?.map((chunk, index) => (
                  <CarouselItem key={index}>
                    {chunk?.map((bullet, bulletIndex) => (
                      <Button
                        key={bullet}
                        frontIcon={<BsPlusCircleDotted />}
                        text={bullet.replace("•", "")}
                        onClick={() => addBullet(bullet)}
                        className="clr-ghost flex-y gap-3 bg-card p-3 text-left !text-weiss hover:bg-primary"
                      />
                    ))}
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        </PopoverContent>
      )}
    </Popover>
  );
};
