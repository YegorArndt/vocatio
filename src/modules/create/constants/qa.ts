const qaSkills =
  "Automated Testing, Bug Tracking, and Quality Assurance Best Practices";

export const stories = [
  {
    id: "QualityFirst",
    story: (skills: string = qaSkills) =>
      `As a QA Engineer at QualityFirst, I employed ${skills} to ensure the highest standards of software quality. My implementation of automated testing frameworks reduced the bug discovery time by 50%, significantly improving the development cycle.`,
  },
  {
    id: "TestMasters",
    story: (skills: string = qaSkills) =>
      `In my role at TestMasters, using ${skills}, I led the quality assurance process, resulting in a 40% decrease in post-release defects and a notable enhancement in customer satisfaction with our products.`,
  },
];

export const highlights = [
  {
    id: "QualityFirst",
    story: (skills: string = qaSkills) => [
      `Implemented automated testing frameworks, reducing bug discovery time by 50%.`,
      `Ensured software quality and compliance with quality assurance standards.`,
      `Collaborated with development teams to identify and resolve software defects.`,
    ],
  },
  {
    id: "TestMasters",
    story: (skills: string = qaSkills) => [
      `Led the quality assurance process, decreasing post-release defects by 40%.`,
      `Managed bug tracking and reporting, streamlining defect resolution.`,
      `Conducted regular team trainings on testing best practices and tools.`,
    ],
  },
];
