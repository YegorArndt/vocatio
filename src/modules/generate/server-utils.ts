export const extractVacancyData = (encodedString: string) => {
  const decodedString = decodeURIComponent(encodedString);

  const keyValuePairs = decodedString.split("&");

  const extractedData = {
    companyName: "",
    jobTitle: "",
    requiredSkills: "",
  };

  keyValuePairs.forEach((pair) => {
    let [key, value] = pair.split("=");

    if (!value) return;

    value = value.replace(/\+/g, " ");

    if (key === "companyName") {
      extractedData.companyName = value;
    } else if (key === "jobTitle") {
      extractedData.jobTitle = value;
    } else if (key === "requiredSkills") {
      extractedData.requiredSkills = value;
    }
  });

  return extractedData;
};
