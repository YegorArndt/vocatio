const productManagerSkills =
  "Market Analysis, Product Roadmapping, and User Feedback Integration";

export const stories = [
  {
    id: "InnovateEdge",
    story: (skills: string = productManagerSkills) =>
      `As a Product Manager at InnovateEdge, I harnessed ${skills} to guide the development of cutting-edge products. My focus on aligning product features with market needs resulted in a 20% increase in market share.`,
  },
  {
    id: "TechPioneers",
    story: (skills: string = productManagerSkills) =>
      `My tenure as a Product Manager at TechPioneers involved leveraging ${skills} to drive product strategy and execution. My emphasis on user-centric design led to a 35% uplift in customer satisfaction ratings.`,
  },
];

export const highlights = [
  {
    id: "InnovateEdge",
    story: (skills: string = productManagerSkills) => [
      `Guided product development aligning with market needs, achieving a 20% market share increase.`,
      `Utilized ${skills} for strategic planning and execution of product features.`,
      `Conducted user research to inform design and functional improvements.`,
    ],
  },
  {
    id: "TechPioneers",
    story: (skills: string = productManagerSkills) => [
      `Drove product strategy using ${skills}, leading to a 35% increase in customer satisfaction.`,
      `Managed product lifecycle from concept to launch, ensuring user-centric design.`,
      `Collaborated with cross-functional teams for seamless product development.`,
    ],
  },
];
