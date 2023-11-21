const projectManagerSkills =
  "Agile Methodologies, Risk Management, and Team Leadership";

export const stories = [
  {
    id: "ProjectFlow",
    story: (skills: string = projectManagerSkills) =>
      `As a Project Manager at ProjectFlow, I employed ${skills} to oversee complex tech projects. My leadership in cross-functional teams resulted in project deliveries that consistently met timelines and budgets, improving overall efficiency by 40%.`,
  },
  {
    id: "BuildTech",
    story: (skills: string = projectManagerSkills) =>
      `At BuildTech, my role as Project Manager involved utilizing ${skills} to streamline project execution. My approach in implementing agile practices led to a 30% improvement in project turnaround time, enhancing client satisfaction.`,
  },
];

export const highlights = [
  {
    id: "ProjectFlow",
    story: (skills: string = projectManagerSkills) => [
      `Oversaw complex tech projects using ${skills}, ensuring timely and budget-compliant deliveries.`,
      `Led cross-functional teams, improving overall efficiency by 40%.`,
      `Implemented risk management strategies to mitigate potential project hurdles.`,
    ],
  },
  {
    id: "BuildTech",
    story: (skills: string = projectManagerSkills) => [
      `Streamlined project execution with ${skills}, enhancing client satisfaction through improved turnaround times.`,
      `Adopted agile practices, resulting in 30% faster project completions.`,
      `Facilitated regular team meetings and stakeholder communications.`,
    ],
  },
];
