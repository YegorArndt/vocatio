const scrumMasterSkills =
  "Agile Coaching, Sprint Planning, and Team Facilitation";

export const stories = [
  {
    id: "AgileTech",
    story: (skills: string = scrumMasterSkills) =>
      `As a Scrum Master at AgileTech, I employed ${skills} to enhance our Agile practices. My leadership in facilitating sprint planning and retrospectives led to a 30% increase in team productivity and a more collaborative work environment.`,
  },
  {
    id: "SprintInnovations",
    story: (skills: string = scrumMasterSkills) =>
      `At SprintInnovations, my role as Scrum Master involved using ${skills} to guide our development teams through complex projects. My focus on Agile methodologies resulted in a 25% reduction in project delivery times and improved team dynamics.`,
  },
];

export const highlights = [
  {
    id: "AgileTech",
    story: (skills: string = scrumMasterSkills) => [
      `Enhanced Agile practices, resulting in a 30% increase in team productivity.`,
      `Facilitated sprint planning and retrospectives, fostering a collaborative work environment.`,
      `Coached teams in Agile methodologies, ensuring efficient project execution.`,
    ],
  },
  {
    id: "SprintInnovations",
    story: (skills: string = scrumMasterSkills) => [
      `Guided development teams through complex projects, reducing delivery times by 25%.`,
      `Implemented Agile frameworks, improving team dynamics and project outcomes.`,
      `Organized and led daily stand-ups, sprint reviews, and planning sessions.`,
    ],
  },
];
