import { useState } from "react";

import { BlurImage } from "../../../components/BlurImage";
import { Link } from "~/components/ui/buttons/Link";
import { Charmander } from "~/modules/create/design/designs/Charmander";

const designs = [Charmander];

export const DesignViewer = () => {
  const [search, setSearch] = useState("");

  return (
    <>
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
              />
              <footer className="flex-center mt-2 gap-2">
                <BlurImage
                  src={`/designs/${d.pokemonImage}`}
                  height={40}
                  width={40}
                  alt={d.name}
                />
                {d.name}
              </footer>
            </div>
          ))}
      </div>
      <Link
        text="Suggest a design ❤️"
        className="primary sm mt-8"
        to="mailto:yegorarndt@gmail.com"
      />
    </>
  );
};
