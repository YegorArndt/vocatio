type ShortUrlObject = {
  original: string;
  shortCode: string;
};

export const getShortUrl = async (original: string) => {
  try {
    const response = await fetch("/api/shorten", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ original }),
    });

    const shortUrlObject = (await response.json()) as ShortUrlObject;
    const host =
      process.env.NODE_ENV === "production" ? "chirp" : "localhost:3000";
    const shortUrl = `${host}/${shortUrlObject.shortCode}`;
    return { shortUrl, original: shortUrlObject.original };
  } catch (error) {
    console.error("Failed to shorten URL:", error);
  }
};

export const validateUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch (_) {
    return false;
  }
};
