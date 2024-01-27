import { BlurImage } from "~/components";
import {
  DrawerContent,
  Drawer,
  DrawerHandle,
  DrawerTrigger,
} from "~/components/ui/external/Drawer";
import { usePersistentData } from "~/hooks/usePersistentData";
import { AFTER_GREEN, BEFORE_RED } from "~/modules/constants";
import { stripHtmlTags } from "~/modules/utils";
import { cn } from "~/utils";

const { log } = console;

const insertNewLineAtBullet = (str: string) => {
  const regex = /•/g;
  return str.replace(regex, "\n•");
};

export const BestPracticesDrawer = () => {
  const { ls } = usePersistentData();

  const disabled = !ls.user?.experience?.[0]?.shadowDescription;

  return (
    <Drawer>
      <DrawerTrigger
        className="primary sm w-min whitespace-nowrap"
        disabled={disabled}
      >
        🔥 See how it looks on your experience
      </DrawerTrigger>
      {!disabled && (
        <DrawerContent className="max-h-[95vh] bg-primary px-10 py-5">
          <DrawerHandle />
          <div className="flex h-full flex-col gap-8 overflow-auto">
            {ls.user!.experience.map((x, i) => (
              <section key={i}>
                <header className="flex-center gap-3">
                  <BlurImage
                    src={x.image}
                    height={40}
                    width={40}
                    className="rounded-full"
                    fallback={<BlurImage src="/loading-cat.gif" />}
                  />
                  <h6 className="text-lg">{x.place}</h6>
                </header>
                <div className="grid h-full grid-cols-2 gap-8 p-5">
                  <div className={cn(BEFORE_RED, "whitespace-pre-wrap")}>
                    {insertNewLineAtBullet(x.description)}
                  </div>
                  <div className={cn(AFTER_GREEN, "whitespace-pre-wrap !pt-0")}>
                    {insertNewLineAtBullet(stripHtmlTags(x.shadowDescription!))}
                  </div>
                </div>
              </section>
            ))}
          </div>
          {/* <DrawerFooter>
            <Button
              frontIcon={<Gpt />}
              text="Regenerate"
              className="primary sm mx-auto w-min"
            />
          </DrawerFooter> */}
        </DrawerContent>
      )}
    </Drawer>
  );
};
