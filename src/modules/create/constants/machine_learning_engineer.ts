const machineLearningEngineerSkills = "Python, TensorFlow, and Neural Networks";

export const stories = [
  {
    id: "MLInnovations",
    story: (skills: string = machineLearningEngineerSkills) =>
      `As a Machine Learning Engineer at MLInnovations, I leveraged ${skills} to develop advanced ML models. My work in predictive analytics contributed to a 35% increase in business insights, driving more informed decision-making.`,
  },
  {
    id: "AIDevelopers",
    story: (skills: string = machineLearningEngineerSkills) =>
      `At AIDevelopers, using ${skills}, I focused on creating AI solutions that revolutionized our approach to data analysis and interpretation. This led to a 40% enhancement in process automation and efficiency.`,
  },
];

export const highlights = [
  {
    id: "MLInnovations",
    story: (skills: string = machineLearningEngineerSkills) => [
      `Developed advanced ML models, increasing business insights by 35% with ${skills}.`,
      `Focused on predictive analytics to drive informed decision-making processes.`,
      `Collaborated with data teams to refine data collection and preprocessing methods.`,
    ],
  },
  {
    id: "AIDevelopers",
    story: (skills: string = machineLearningEngineerSkills) => [
      `Created AI solutions, enhancing process automation and efficiency by 40%.`,
      `Utilized ${skills} for building and training neural network models.`,
      `Participated in research and development initiatives for new AI applications.`,
    ],
  },
];
