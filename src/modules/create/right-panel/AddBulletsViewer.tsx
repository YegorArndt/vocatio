import { useCurrentDraft } from "~/hooks/useCurrentDraft";
import { useMemo, useState } from "react";
import { HydratableComponent } from "../design/types";
import { Button } from "~/components/ui/buttons/Button";
import { IoIosArrowRoundBack } from "react-icons/io";
import { BlurImage } from "~/components";
import { BsPlusCircleDotted } from "react-icons/bs";
import { Link } from "~/components/ui/buttons/Link";
import { cn } from "~/utils";
import { Badge } from "~/components/ui/external/Badge";
import {
  SET_RIGHT_PANEL_VIEW_EVENT,
  ADD_BULLET_TO_ENTRY_EVENT,
} from "~/modules/events";

const { log } = console;

export type AddBulletsViewerProps = {
  component: HydratableComponent;
};

export const AddBulletsViewer = (props: AddBulletsViewerProps) => {
  const { component: c } = props;
  const { currentDraft } = useCurrentDraft();
  const [activeTab, setActiveTab] = useState(0 as 0 | 1 | 2);

  const backToDesignViewer = () => {
    document.dispatchEvent(
      new CustomEvent(SET_RIGHT_PANEL_VIEW_EVENT, {
        detail: { view: "designs" },
      })
    );
  };

  const entry = currentDraft?.generatedExperience?.find(
    (exp) => exp.id === c.id
  );

  const addBullet = (bullet: string) => {
    if (!currentDraft || !entry) return;

    document.dispatchEvent(
      new CustomEvent(ADD_BULLET_TO_ENTRY_EVENT, {
        detail: { bullet, entryId: entry.id },
      })
    );
  };

  const tabs = useMemo(() => {
    if (!currentDraft) return;

    return {
      0: {
        title: (
          <h4 className="flex-y gap-3">
            Generated for {currentDraft?.vacancy?.companyName}{" "}
            <BlurImage src={currentDraft?.vacancy?.image} />
          </h4>
        ),
        description: (
          <p className="clr-ghost">
            The AI took your original bullet points, enhanced, and then tailored
            them to the vacancy responsibilities.
          </p>
        ),
        bullets: entry?.generatedDescription,
      },
      1: {
        title: <h4>Enhanced bullet points without tailoring</h4>,
        description: (
          <p className="clr-ghost">
            The AI enhanced your original bullet points to adhere to the best
            practices.{" "}
            <Link
              text="Opt out here."
              to="/preferences/customize-ai"
              className="underline"
              newTab
            />
          </p>
        ),
        bullets:
          entry?.enhancedDescription ||
          entry?.description?.split("•").filter((bullet) => bullet),
      },
      2: {
        title: <h4>Original texts</h4>,
        description: (
          <p className="clr-ghost">Untouched initial texts you provided.</p>
        ),
        bullets: entry?.description?.split("•").filter((bullet) => bullet),
      },
    };
  }, [currentDraft, entry]);

  return (
    <div className="flex flex-col gap-3 @container">
      <header>
        <Button
          text="Back to designs"
          frontIcon={<IoIosArrowRoundBack />}
          className="flex-y clr-ghost hover:underline"
          onClick={backToDesignViewer}
        />
      </header>
      <h2 className="flex-y flex-wrap gap-3 text-lg leading-7">
        Add to
        <div className="flex-y gap-2 ">
          <BlurImage
            src={entry?.image}
            fallback={<BlurImage src="/loading-cat.gif" />}
            width={20}
          />
          {entry?.place} <Badge>Beta</Badge>
        </div>
      </h2>

      <div className="mb-5 flex flex-col @md:grid @md:grid-cols-3">
        {["Generated", "Enhanced", "Original"].map((tab, i) => (
          <Button
            key={tab}
            text={tab}
            className={cn("flex-center sm rounded-md hover:bg-hover", {
              "border bg-hover": i === activeTab,
            })}
            onClick={() => setActiveTab(i as 0 | 1 | 2)}
          />
        ))}
      </div>

      {tabs && (
        <section>
          {tabs[activeTab].title}
          {tabs[activeTab].description}
          <div className="my-5 flex flex-col gap-4">
            {/* @ts-ignore  */}
            {tabs[activeTab].bullets?.map((bullet: string) => (
              <Button
                key={bullet}
                frontIcon={<BsPlusCircleDotted />}
                text={bullet.replace("•", "")}
                className="flex-y rounded-md border bg-primary p-2 text-left text-[13px]"
                onClick={() => addBullet(bullet)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
