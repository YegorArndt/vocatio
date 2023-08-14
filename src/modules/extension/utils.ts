import pako from "pako";

import { type RawVacancy } from "./types";

const decompress = (base64Compressed: string) => {
  let binaryData = new Uint8Array(
    atob(base64Compressed)
      .split("")
      .map((char) => char.charCodeAt(0))
  );
  let decompressedStr = pako.inflate(binaryData, { to: "string" });
  return decompressedStr;
};

const formatForClient = (rawVacancy: RawVacancy) => {
  const { requirementsBase64, ...rawVacancyWithoutCompressed } = rawVacancy;
  const decompressed = decompress(requirementsBase64);

  return {
    ...rawVacancyWithoutCompressed,
    requirements: decompressed,
  };
};

export const getVacancy = (rawVacancy: RawVacancy) => {
  const ls = localStorage.getItem(`vacancy-${rawVacancy.id}`);
  if (ls) return JSON.parse(ls);
  const vacancy = formatForClient(rawVacancy);
  localStorage.setItem(`vacancy-${rawVacancy.id}`, JSON.stringify(vacancy));

  return vacancy;
};
