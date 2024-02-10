import { useCurrentDraft } from "~/hooks/useCurrentDraft";
import { useMemo, useState } from "react";
import { GeneratedDraft, HydratableComponent } from "../design/types";
import { ADD_BULLET_EVENT, SET_VIEW_EVENT } from "~/modules/init-gen/constants";
import { Button } from "~/components/ui/buttons/Button";
import { IoIosArrowRoundBack } from "react-icons/io";
import { BlurImage } from "~/components";
import { BsPlusCircleDotted } from "react-icons/bs";
import { Link } from "~/components/ui/buttons/Link";
import { cn } from "~/utils";
import { Badge } from "~/components/ui/external/Badge";

const { log } = console;

export type BulletsProps = {
  component: HydratableComponent;
};

type GeneratedExperience = GeneratedDraft["generatedExperience"];

export const Bullets = (props: BulletsProps) => {
  const { component: c } = props;
  const { currentDraft } = useCurrentDraft();
  const [activeTab, setActiveTab] = useState(0 as 0 | 1 | 2);

  const backToDesignViewer = () => {
    document.dispatchEvent(
      new CustomEvent(SET_VIEW_EVENT, { detail: { view: "designs" } })
    );
  };

  const entry = currentDraft?.generatedExperience?.find(
    (exp) => exp.id === c.id
  );

  const addBullet = (bullet: string) => {
    if (!currentDraft || !entry) return;

    document.dispatchEvent(
      new CustomEvent(ADD_BULLET_EVENT, {
        detail: { newBullet: bullet },
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
            The AI took your original bullet points, optimized, and then
            tailored them to the vacancy responsibilities.
          </p>
        ),
        bullets: entry?.generatedDescription,
      },
      1: {
        title: <h4>Optimized bullet points without tailoring</h4>,
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
        bullets: entry?.shadowDescription
          ?.split("•")
          .filter((bullet) => bullet),
      },
      2: {
        title: <h4>Original bullet points</h4>,
        description: (
          <p className="clr-ghost">
            Untouched initial bullet points you provided.
          </p>
        ),
        bullets: entry?.description?.split("•").filter((bullet) => bullet),
      },
    };
  }, [currentDraft]);

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
      <h2 className="flex-y flex-wrap gap-x-3">
        Add to
        <div className="flex-y gap-2">
          <BlurImage
            src={entry?.image}
            fallback={<BlurImage src="/loading-cat.gif" />}
          />
          {entry?.place} <Badge>Beta</Badge>
        </div>
      </h2>

      <div className="mb-5 flex flex-col @md:grid @md:grid-cols-3">
        {["Generated", "Optimized", "Original"].map((tab, i) => (
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
            {tabs[activeTab].bullets?.map((bullet) => (
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