import { IoNewspaper } from "react-icons/io5";
import { Button } from "~/components/ui/buttons/Button";

const { log } = console;

const ID = "838e17d1-b1d7-449d-8546-d981006effbb";

export const BuildDefaultCvLink = () => {
  return (
    <Button
      frontIcon={<IoNewspaper />}
      text="Build my default CV"
      className="sm primary"
      // to="/create/default"
      disabled
    />
  );
};
