const uiUxDesignerSkills = "User Research, Prototyping, and Interaction Design";

export const stories = [
  {
    id: "DesignInnovate",
    story: (skills: string = uiUxDesignerSkills) =>
      `As a UI/UX Designer at DesignInnovate, I used ${skills} to craft engaging user interfaces and experiences. My work in revamping the user journey led to a 30% increase in user retention and a significant boost in overall user satisfaction.`,
  },
  {
    id: "VisualCraft",
    story: (skills: string = uiUxDesignerSkills) =>
      `At VisualCraft, my role as a UI/UX Designer involved leveraging ${skills} to create intuitive and aesthetically pleasing application designs. My focus on user-centric design principles resulted in a 25% increase in application usability scores.`,
  },
];

export const highlights = [
  {
    id: "DesignInnovate",
    story: (skills: string = uiUxDesignerSkills) => [
      `Crafted engaging user interfaces and experiences, increasing user retention by 30%.`,
      `Utilized ${skills} to revamp user journey, significantly boosting overall user satisfaction.`,
      `Conducted A/B testing and user feedback sessions to refine design elements.`,
    ],
  },
  {
    id: "VisualCraft",
    story: (skills: string = uiUxDesignerSkills) => [
      `Led interface redesign for flagship product, improving application usability by 25%.`,
      `Implemented responsive design principles using ${skills}, enhancing cross-device compatibility.`,
      `Collaborated with product teams to align design with user needs and business goals.`,
    ],
  },
];
