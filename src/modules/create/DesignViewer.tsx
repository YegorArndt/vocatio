import { useEffect, useRef, useState } from "react";

import { useDraftContext } from "~/modules/draft/DraftContext";
import { BlurImage } from "../../components/BlurImage";
import type { Design } from "~/modules/draft/types/design";
import { Venusaur } from "~/modules/draft/designs/Venusaur";

const designs = [Venusaur];

export const DesignViewer = () => {
  const { changeDesign, design } = useDraftContext();
  const [search, setSearch] = useState("");

  const initialDesign = useRef<Design | null>(null);

  useEffect(() => {
    initialDesign.current = design;
  }, []);

  return (
    <div className="right-aside z-layout border bg-secondary p-5">
      <input
        placeholder="Search designs here..."
        className="bg-transparent outline-none"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        autoFocus
      />
      <br />
      <br />
      <div className="card-grid">
        {designs
          .filter((d) => d.name.toLowerCase().includes(search.toLowerCase()))
          .map((d) => (
            <div key={d.name}>
              <BlurImage
                onClick={() => changeDesign(d)}
                src={d.image}
                height={200}
                width={200}
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
