const analystSkills =
  "Data Analysis, Reporting, and Business Intelligence Tools";

export const stories = [
  {
    id: "InfoAnalytics",
    story: (skills: string = analystSkills) =>
      `As an Analyst at InfoAnalytics, I utilized ${skills} to provide in-depth market and data analysis. My reports influenced key business strategies, resulting in a 20% increase in operational effectiveness.`,
  },
  {
    id: "StrategyInsight",
    story: (skills: string = analystSkills) =>
      `In my role at StrategyInsight, applying ${skills} enabled me to deliver actionable insights that drove business growth. My focus on leveraging business intelligence tools led to a 25% improvement in strategic planning accuracy.`,
  },
];

export const highlights = [
  {
    id: "InfoAnalytics",
    story: (skills: string = analystSkills) => [
      `Provided comprehensive market and data analysis, enhancing operational effectiveness by 20%.`,
      `Utilized ${skills} for in-depth reporting and business strategy development.`,
      `Collaborated with various departments to align data insights with business objectives.`,
    ],
  },
  {
    id: "StrategyInsight",
    story: (skills: string = analystSkills) => [
      `Delivered actionable insights for business growth, improving strategic planning accuracy by 25%.`,
      `Leveraged business intelligence tools for effective data interpretation and visualization.`,
      `Conducted market research to inform data-driven decision-making processes.`,
    ],
  },
];
