const embeddedDeveloperSkills =
  "C/C++, Microcontroller Programming, and IoT Solutions";

export const stories = [
  {
    id: "EmbeddedTech",
    story: (skills: string = embeddedDeveloperSkills) =>
      `As an Embedded Developer at EmbeddedTech, I specialized in ${skills}, creating efficient and reliable embedded systems. My contributions to IoT projects led to a 30% improvement in system performance and a notable reduction in energy consumption.`,
  },
  {
    id: "SmartSolutions",
    story: (skills: string = embeddedDeveloperSkills) =>
      `In my position at SmartSolutions, applying ${skills} enabled me to develop innovative embedded applications. My focus on optimizing hardware-software integration resulted in the successful launch of several smart devices, enhancing our market presence.`,
  },
];

export const highlights = [
  {
    id: "EmbeddedTech",
    story: (skills: string = embeddedDeveloperSkills) => [
      `Specialized in creating efficient embedded systems with ${skills}, improving system performance by 30%.`,
      `Contributed to IoT projects, leading to reduced energy consumption and enhanced functionality.`,
      `Collaborated with cross-functional teams to integrate software with hardware effectively.`,
    ],
  },
  {
    id: "SmartSolutions",
    story: (skills: string = embeddedDeveloperSkills) => [
      `Developed innovative embedded applications, bolstering our market presence in smart device technology.`,
      `Focused on optimizing hardware-software integration for better device performance.`,
      `Conducted extensive testing to ensure reliability and durability of embedded systems.`,
    ],
  },
];
