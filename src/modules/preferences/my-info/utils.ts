import { GetServerSidePropsContext } from "next";
import { UserBox } from "./boxes/types";
import { userBoxes } from "./constants";
import { intersection } from "lodash-es";

export const getBoxesFromUrl = (
  params: GetServerSidePropsContext["params"]
) => {
  if (!Array.isArray(params)) return {};

  const expToken = params.pop();
  const extractedBoxes = intersection(params, userBoxes) as UserBox[];

  return {
    boxesToUpdateOnLoad: extractedBoxes,
    expToken,
  };
};
