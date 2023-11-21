const backendSkills = "Node.js, Express, and MongoDB";

export const stories = [
  {
    id: "DataHub",
    story: (skills: string = backendSkills) =>
      `As a Backend Developer at DataHub, I was instrumental in developing and maintaining the server-side logic using ${skills}. My work in optimizing database interactions improved data retrieval speeds by 40%, significantly enhancing the overall performance of our web applications.`,
  },
  {
    id: "TechStream",
    story: (skills: string = backendSkills) =>
      `At TechStream, my role as a Backend Developer involved using ${skills} to create robust APIs and manage data exchange between servers and users. My efforts led to a more scalable architecture and a 35% reduction in server response times.`,
  },
];

export const highlights = [
  {
    id: "DataHub",
    story: (skills: string = backendSkills) => [
      `Developed server-side logic and database interactions using ${skills}.`,
      `Optimized database queries, improving data retrieval speeds by 40%.`,
      `Collaborated with frontend developers to integrate APIs efficiently.`,
    ],
  },
  {
    id: "TechStream",
    story: (skills: string = backendSkills) => [
      `Created robust APIs and managed server-user data exchange using ${skills}.`,
      `Enhanced system scalability, reducing server response times by 35%.`,
      `Led a backend team of 4, focusing on agile development practices.`,
    ],
  },
];
