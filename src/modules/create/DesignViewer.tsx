import { useState } from "react";

import { BlurImage } from "../../components/BlurImage";
import { Charmander } from "~/modules/create/design/designs/Charmander";
import { AnimatedDiv } from "~/components/AnimatedDiv";
import { useDesignContext } from "./design/contexts/DesignContext";
import { Charizard } from "./design/designs/Charizard";
import { capitalize } from "lodash-es";
import { typedValues } from "../utils";
import { Design, DesignName } from "./design/types";
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import { updateSettings } from "../settings/settings";

export const designs: Record<DesignName, Design> = {
  charizard: Charizard,
  charmander: Charmander,
};

export const DesignViewer = () => {
  const [search, setSearch] = useState("");
  const { changeDesign, design } = useDesignContext();

  const onDesignChange = (d: Design) => {
    changeDesign(d);
    updateSettings((prev) => ({ ...prev, defaultDesign: d.name }));
  };

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
      <div className="flex-y flex-wrap gap-5">
        {typedValues(designs)
          .filter((d) => d.name.toLowerCase().includes(search.toLowerCase()))
          .map((d) => (
            <div key={d.name} className="relative">
              <BlurImage
                onClick={() => onDesignChange(d)}
                src={`/designs/${d.image}`}
                fill
                className="relative h-[250px] w-[200px] transform cursor-pointer transition hover:-translate-y-1 motion-reduce:transition-none"
                priority
              />
              {design.name === d.name && (
                <div className="-z-1 flex-center absolute inset-0 h-[250px] w-[200px] cursor-pointer gap-2 bg-green opacity-80">
                  <IoCheckmarkCircleOutline size={30} />
                  Default
                </div>
              )}
              <footer className="flex-center clr-ghost mt-2 gap-2">
                <BlurImage
                  src={`/designs/${d.pokemonImage}`}
                  height={30}
                  width={30}
                />
                {capitalize(d.name)}
              </footer>
            </div>
          ))}
      </div>
    </AnimatedDiv>
  );
};
