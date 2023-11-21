const networkEngineerSkills =
  "Network Configuration, Troubleshooting, and Security Management";

export const stories = [
  {
    id: "NetTech",
    story: (skills: string = networkEngineerSkills) =>
      `As a Network Engineer at NetTech, I focused on ${skills} to maintain and optimize our enterprise network. My strategies in network design and management led to a 60% improvement in network reliability and performance.`,
  },
  {
    id: "ConnectSolutions",
    story: (skills: string = networkEngineerSkills) =>
      `At ConnectSolutions, my expertise in ${skills} was essential in ensuring robust network security and efficiency. My work in deploying advanced security protocols reduced network vulnerabilities by 50%, enhancing our overall cyber resilience.`,
  },
];

export const highlights = [
  {
    id: "NetTech",
    story: (skills: string = networkEngineerSkills) => [
      `Maintained enterprise network, achieving 60% improvement in reliability and performance.`,
      `Implemented network security protocols, reducing vulnerabilities by 50%.`,
      `Provided technical support and guidance for network configuration and troubleshooting.`,
    ],
  },
  {
    id: "ConnectSolutions",
    story: (skills: string = networkEngineerSkills) => [
      `Oversaw network security and efficiency, enhancing cyber resilience.`,
      `Deployed advanced security protocols and network management tools using ${skills}.`,
      `Collaborated with IT teams on network design and optimization projects.`,
    ],
  },
];
