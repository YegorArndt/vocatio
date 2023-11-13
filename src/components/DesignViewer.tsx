import Image from "next/image";
import { AiFillCheckCircle, AiOutlineInfoCircle } from "react-icons/ai";
import { TiCancel } from "react-icons/ti";

import { Button } from "./ui/buttons/Button";
import { useDraftContext } from "~/modules/draft/DraftContext";
import { Venusaur } from "~/modules/draft/designs/Venusaur";
import { Charizard } from "~/modules/draft/designs/Charizard";

const designs = [Charizard, Venusaur];

export const DesignViewer = () => {
  const {
    dispatchers: { setChangeDesignFired },
    changeDesign,
    design,
  } = useDraftContext();

  return (
    <div className="flex flex-col gap-6">
      <div className="grid max-h-[550px] grid-cols-2 gap-4 overflow-auto ">
        {designs.map((d) => (
          <Button
            key={d.name}
            className="h-full w-full transform transition hover:-translate-y-1 motion-reduce:transition-none"
            onClick={() => changeDesign(d)}
          >
            <Image
              src={d.image}
              alt={d.name}
              width={100}
              height={100}
              layout="responsive"
            />
          </Button>
        ))}
      </div>
      <div className="flex items-center gap-4 [&>*]:shrink-0">
        <Button
          className="primary lg"
          onClick={() => setChangeDesignFired(false)}
        >
          <AiFillCheckCircle /> Accept
        </Button>
        <Button
          className="outlined lg"
          onClick={() => setChangeDesignFired(false)}
        >
          <TiCancel /> Cancel
        </Button>
        <span>You&apos;re viewing: {design.name} design</span>
      </div>
      <span className="flex items-center gap-5 rounded-md border p-3">
        <AiOutlineInfoCircle size={50} />
        <div>
          We&apos;ll try to minimize data loss when switching between designs.
          In the future before switching designs, you will be able to save your
          current design without downloading it.
        </div>
      </span>
    </div>
  );
};
