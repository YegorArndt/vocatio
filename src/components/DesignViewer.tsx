import { AiFillCheckCircle } from "react-icons/ai";
import { TiCancel } from "react-icons/ti";

import { Button } from "./ui/buttons/Button";
import { useDraftContext } from "~/modules/draft/DraftContext";
import { Venusaur } from "~/modules/draft/designs/Venusaur";
import { Charizard } from "~/modules/draft/designs/Charizard";
import { BlurImage } from "./BlurImage";
import { InfoBox } from "./InfoBox";
import { Nidoqueen } from "~/modules/draft/designs/Nidoqueen";
import { useEffect, useRef } from "react";
import { Design } from "~/modules/draft/types";

const designs = [Venusaur, Charizard, Nidoqueen];

export const DesignViewer = () => {
  const {
    dispatchers: { setChangeDesignFired },
    changeDesign,
    design,
  } = useDraftContext();

  const initialDesign = useRef<Design | null>(null);

  useEffect(() => {
    initialDesign.current = design;
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid max-h-[550px] grid-cols-2 gap-4 overflow-auto">
        {designs.map((d) => (
          <Button
            key={d.name}
            className="transform transition hover:-translate-y-1 motion-reduce:transition-none"
            onClick={() => changeDesign(d)}
          >
            <BlurImage
              key={d.name}
              src={d.image}
              height={300}
              width={300}
              alt={d.name}
            />
          </Button>
        ))}
      </div>
      <div className="flex items-center gap-4 [&>*]:shrink-0">
        <Button
          frontIcon={<AiFillCheckCircle />}
          text="Accept"
          className="primary lg"
          onClick={() => setChangeDesignFired(false)}
        />
        <Button
          frontIcon={<TiCancel />}
          text="Cancel"
          className="outlined lg"
          onClick={() => {
            changeDesign(initialDesign.current!);
            setChangeDesignFired(false);
          }}
        />
        <span className="flex items-center gap-3">
          You&apos;re viewing: {design.name} design
          <BlurImage
            src={design.pokemonImage}
            alt={design.name}
            height={50}
            width={50}
          />
        </span>
      </div>
      <InfoBox
        text="We'll try to minimize data loss when switching between designs.
          In the future before switching designs, you will be able to save your
          current design without downloading it."
      />
    </div>
  );
};
