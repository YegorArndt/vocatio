export const boldKeywords = (text: string, keywords: string) => {
  const vacancyWords = new Set(keywords.toLowerCase().match(/\w+/g));

  return text.replace(/\w+/g, (word) => {
    if (vacancyWords.has(word.toLowerCase())) {
      return `<span class="font-bold">${word}</span>`;
    }
    return word;
  });
};
