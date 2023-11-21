const databaseAdministratorSkills =
  "SQL, Database Optimization, and Data Security";

export const stories = [
  {
    id: "DataStore",
    story: (skills: string = databaseAdministratorSkills) =>
      `As a Database Administrator at DataStore, my expertise in ${skills} was crucial in managing large-scale databases. I implemented strategies that improved data retrieval times by 40%, enhancing the efficiency of our data-driven applications.`,
  },
  {
    id: "InfoVault",
    story: (skills: string = databaseAdministratorSkills) =>
      `At InfoVault, as a Database Administrator, I utilized ${skills} to ensure the integrity and security of our data storage systems. My approach to database management led to a 35% reduction in data redundancy and improved data accuracy.`,
  },
];

export const highlights = [
  {
    id: "DataStore",
    story: (skills: string = databaseAdministratorSkills) => [
      `Managed large-scale databases, improving data retrieval times by 40% with ${skills}.`,
      `Implemented data security measures, ensuring the integrity of storage systems.`,
      `Conducted regular database performance tuning and optimization.`,
    ],
  },
  {
    id: "InfoVault",
    story: (skills: string = databaseAdministratorSkills) => [
      `Ensured data accuracy and reduced redundancy by 35% using ${skills}.`,
      `Developed and maintained database backup and recovery strategies.`,
      `Collaborated with development teams for efficient database integration.`,
    ],
  },
];
