export const flattenObject = (obj, parentKey = "", result = {}) => {
  for (let key in obj) {
    if (typeof obj[key] === "function") {
      continue; // Ignore functions
    }

    let propName = parentKey ? `${parentKey}.${key}` : key;
    if (
      typeof obj[key] === "object" &&
      obj[key] !== null &&
      !Array.isArray(obj[key])
    ) {
      flattenObject(obj[key], propName, result);
    } else {
      result[propName] = obj[key];
    }
  }
  return result as Record<string, unknown>;
};

export const isNested = (sectionName: string) =>
  ["education"].includes(sectionName);

export const isDraggable = (rhfKey: string) => {
  const substrings = ["main"];

  return !substrings.some((substring) => rhfKey.includes(substring));
};
