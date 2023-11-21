const cloudEngineerSkills = "AWS, Azure, and Cloud Architecture";

export const stories = [
  {
    id: "CloudPioneers",
    story: (skills: string = cloudEngineerSkills) =>
      `As a Cloud Engineer at CloudPioneers, using ${skills}, I played a crucial role in designing and managing cloud infrastructures. My work in cloud optimization led to a 30% reduction in costs while improving scalability and performance.`,
  },
  {
    id: "SkyTech",
    story: (skills: string = cloudEngineerSkills) =>
      `In my tenure at SkyTech, I utilized ${skills} to implement cloud solutions that enhanced our operational efficiency. My efforts in cloud migration strategies resulted in a 45% improvement in data accessibility and processing speed.`,
  },
];

export const highlights = [
  {
    id: "CloudPioneers",
    story: (skills: string = cloudEngineerSkills) => [
      `Designed and managed cloud infrastructures, reducing operational costs by 30%.`,
      `Optimized cloud services for scalability and performance using ${skills}.`,
      `Led cloud migration projects, improving data accessibility and processing speed.`,
    ],
  },
  {
    id: "SkyTech",
    story: (skills: string = cloudEngineerSkills) => [
      `Implemented cloud solutions, enhancing operational efficiency and data processing capabilities.`,
      `Focused on cloud architecture optimization and resource management.`,
      `Conducted training sessions for teams on cloud technologies and best practices.`,
    ],
  },
];
