const devopsSkills = "CI/CD Pipelines, Kubernetes, and Cloud Infrastructure";

export const stories = [
  {
    id: "DevFlow",
    story: (skills: string = devopsSkills) =>
      `As a DevOps Engineer at DevFlow, I was responsible for automating and optimizing our CI/CD workflows using ${skills}. My efforts led to a 50% reduction in deployment times and significantly improved system reliability.`,
  },
  {
    id: "CloudTech",
    story: (skills: string = devopsSkills) =>
      `In my position at CloudTech, implementing ${skills} enabled us to scale our cloud infrastructure effectively, resulting in a 40% cost reduction while maintaining high availability and performance.`,
  },
];

export const highlights = [
  {
    id: "DevFlow",
    story: (skills: string = devopsSkills) => [
      `Automated and optimized CI/CD workflows using ${skills}, reducing deployment times by 50%.`,
      `Managed and scaled cloud infrastructure, ensuring high system reliability.`,
      `Collaborated with development teams to streamline deployment processes.`,
    ],
  },
  {
    id: "CloudTech",
    story: (skills: string = devopsSkills) => [
      `Implemented cloud solutions with ${skills}, reducing operational costs by 40%.`,
      `Enhanced system scalability and performance through cloud infrastructure optimization.`,
      `Conducted regular system audits to ensure security and efficiency.`,
    ],
  },
];
