const dataScientistSkills =
  "Machine Learning, Statistical Analysis, and Data Visualization";

export const stories = [
  {
    id: "DataInsight",
    story: (skills: string = dataScientistSkills) =>
      `As a Data Scientist at DataInsight, I utilized ${skills} to extract actionable insights from complex datasets. My models improved decision-making processes, resulting in a 25% increase in business efficiency.`,
  },
  {
    id: "AnalyticsPro",
    story: (skills: string = dataScientistSkills) =>
      `In my role at AnalyticsPro, applying ${skills} enabled me to lead data-driven strategies that transformed raw data into valuable business intelligence, contributing to a 40% growth in revenue.`,
  },
];

export const highlights = [
  {
    id: "DataInsight",
    story: (skills: string = dataScientistSkills) => [
      `Developed ML models using ${skills}, enhancing business decision-making by 25%.`,
      `Performed complex data analyses to extract actionable insights.`,
      `Created intuitive data visualizations to communicate findings to non-technical stakeholders.`,
    ],
  },
  {
    id: "AnalyticsPro",
    story: (skills: string = dataScientistSkills) => [
      `Led data-driven strategies, contributing to a 40% revenue growth with ${skills}.`,
      `Collaborated with IT teams to improve data collection and processing methods.`,
      `Conducted workshops on data literacy and best practices for the company.`,
    ],
  },
];
