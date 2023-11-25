import { useEffect, useRef, useState } from "react";

import { useDraftContext } from "~/modules/draft/DraftContext";
import { BlurImage } from "../../components/BlurImage";
import type { Design } from "~/modules/draft/types/design";
import { Charizard } from "~/modules/draft/designs/Charizard";
import { Charmander } from "~/modules/draft/designs/Charmander";
import { Venusaur } from "~/modules/draft/designs/Venusaur";
import { Raichu } from "~/modules/draft/designs/Raichu";
import { Jigglypuff } from "~/modules/draft/designs/Jigglypuff";

const designs = [Venusaur, Charizard, Charmander, Raichu, Jigglypuff];

export const DesignViewer = () => {
  const { changeDesign, design } = useDraftContext();
  const [search, setSearch] = useState("");

  const initialDesign = useRef<Design | null>(null);

  useEffect(() => {
    initialDesign.current = design;
  }, []);

  return (
    <div className="z-layout grow border bg-secondary p-5">
      <input
        placeholder="Search designs here..."
        className="reset w-5 bg-transparent"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        autoFocus
      />
      <br />
      <br />
      <div className="auto-grid">
        {designs
          .filter((d) => d.name.toLowerCase().includes(search.toLowerCase()))
          .map((d) => (
            <div key={d.name}>
              <BlurImage
                onClick={() => changeDesign(d)}
                src={d.image}
                height={250}
                width={250}
                alt={d.name}
                className="transform cursor-pointer transition hover:-translate-y-1 motion-reduce:transition-none"
              />
              <p className="flex-center mt-2 gap-2">
                <BlurImage
                  src={d.pokemonImage}
                  height={40}
                  width={40}
                  alt={d.name}
                />
                {d.name}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
};
