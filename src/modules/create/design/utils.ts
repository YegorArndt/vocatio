export const isUrl = (url: string | null | undefined) => {
  if (!url) return false;

  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * This approach is more permissive and might allow some strings that are not technically valid URLs
 * according to the official specification, but it could be more practical depending on your use case.
 */
export const isUrlPermissive = (url: string | null | undefined) => {
  if (!url) return false;

  // Regex to check for a basic structure of a URL (more lenient than URL constructor)
  const urlPattern =
    /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
  return urlPattern.test(url);
};
