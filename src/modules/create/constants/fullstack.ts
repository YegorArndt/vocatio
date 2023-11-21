const fullstackSkills = "React, Node.js, and PostgreSQL";

export const stories = [
  {
    id: "InnoTech",
    story: (skills: string = fullstackSkills) =>
      `As a Fullstack Developer at InnoTech, I developed end-to-end solutions using ${skills}. My balanced focus on both frontend and backend development allowed for seamless integration, resulting in a 50% faster product launch cycle.`,
  },
  {
    id: "DevSolutions",
    story: (skills: string = fullstackSkills) =>
      `In my role at DevSolutions, leveraging ${skills} allowed me to contribute to both the client and server side of our applications. My work ensured a consistent and efficient user experience, boosting user retention by 25%.`,
  },
];

export const highlights = [
  {
    id: "InnoTech",
    story: (skills: string = fullstackSkills) => [
      `Developed end-to-end solutions using ${skills}, balancing frontend and backend needs.`,
      `Streamlined integration processes, resulting in 50% faster product launch cycles.`,
      `Mentored junior developers in fullstack development best practices.`,
    ],
  },
  {
    id: "DevSolutions",
    story: (skills: string = fullstackSkills) => [
      `Contributed to client and server side of applications using ${skills}.`,
      `Implemented responsive design, boosting user retention by 25%.`,
      `Participated in code reviews and sprint planning as a senior team member.`,
    ],
  },
];
