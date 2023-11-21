const systemAdministratorSkills =
  "Network Management, Server Administration, and System Security";

export const stories = [
  {
    id: "NetSecure",
    story: (skills: string = systemAdministratorSkills) =>
      `As a System Administrator at NetSecure, I focused on ${skills} to ensure optimal operation of our IT infrastructure. My proactive approach in system maintenance and upgrades led to a 95% uptime and a significant reduction in system outages.`,
  },
  {
    id: "TechGuard",
    story: (skills: string = systemAdministratorSkills) =>
      `In my role at TechGuard, applying ${skills} enabled me to enhance our network security and efficiency. My efforts in optimizing system configurations resulted in a 30% improvement in network performance and reliability.`,
  },
];

export const highlights = [
  {
    id: "NetSecure",
    story: (skills: string = systemAdministratorSkills) => [
      `Managed IT infrastructure, achieving 95% system uptime through proactive maintenance.`,
      `Implemented system upgrades and security measures, reducing system outages significantly.`,
      `Collaborated with security teams to strengthen network and system defenses.`,
    ],
  },
  {
    id: "TechGuard",
    story: (skills: string = systemAdministratorSkills) => [
      `Optimized network performance and reliability, improving it by 30% with ${skills}.`,
      `Led disaster recovery planning and execution, ensuring data integrity and availability.`,
      `Provided technical support and training for staff on system operations.`,
    ],
  },
];
