import { useState } from "react";

import { BlurImage } from "../../components/BlurImage";
import { Charmander } from "~/modules/create/design/designs/Charmander";
import { AnimatedDiv } from "~/components/AnimatedDiv";

const designs = [Charmander];

export const DesignViewer = () => {
  const [search, setSearch] = useState("");

  return (
    <AnimatedDiv className="border bg-secondary p-5">
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
                // onClick={() => changeDesign(d)}
                src={`/designs/${d.image}`}
                height={200}
                width={200}
                alt={d.name}
                className="transform cursor-pointer transition hover:-translate-y-1 motion-reduce:transition-none"
                priority
              />
              <footer className="flex-center clr-ghost mt-2 gap-2">
                <BlurImage
                  src={`/designs/${d.pokemonImage}`}
                  height={30}
                  width={30}
                  alt={d.name}
                />
                {d.name}
              </footer>
            </div>
          ))}
      </div>
    </AnimatedDiv>
  );
};
