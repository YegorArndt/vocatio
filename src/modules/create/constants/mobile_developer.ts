const mobileDeveloperSkills = "Swift, Kotlin, and React Native";

export const stories = [
  {
    id: "MobileInnovations",
    story: (skills: string = mobileDeveloperSkills) =>
      `As a Mobile Developer at MobileInnovations, I utilized ${skills} to create high-performing mobile applications. My focus on optimizing application performance and usability led to a 50% increase in user engagement on our platforms.`,
  },
  {
    id: "AppCraft",
    story: (skills: string = mobileDeveloperSkills) =>
      `At AppCraft, my role as a Mobile Developer involved using ${skills} to develop intuitive and responsive mobile interfaces. My work contributed to a 40% increase in app downloads and a significant improvement in user reviews.`,
  },
];

export const highlights = [
  {
    id: "MobileInnovations",
    story: (skills: string = mobileDeveloperSkills) => [
      `Created high-performing mobile applications, increasing user engagement by 50%.`,
      `Optimized application performance and usability with ${skills}.`,
      `Worked closely with UI/UX designers to ensure a seamless user experience.`,
    ],
  },
  {
    id: "AppCraft",
    story: (skills: string = mobileDeveloperSkills) => [
      `Developed responsive mobile interfaces, contributing to a 40% increase in app downloads.`,
      `Implemented key features in mobile apps using ${skills}, enhancing user reviews.`,
      `Participated in agile development cycles and sprint reviews.`,
    ],
  },
];
