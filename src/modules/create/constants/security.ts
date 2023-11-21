const securitySkills =
  "Penetration Testing, Cryptography, and Network Security";

export const stories = [
  {
    id: "SecureNet",
    story: (skills: string = securitySkills) =>
      `As a Security Engineer at SecureNet, I focused on ${skills} to safeguard our digital assets. My efforts in implementing advanced encryption protocols reduced security breaches by 60%, enhancing our system's reliability.`,
  },
  {
    id: "GuardianTech",
    story: (skills: string = securitySkills) =>
      `In my tenure at GuardianTech, using ${skills}, I developed comprehensive security strategies that significantly mitigated risks and vulnerabilities, leading to a 70% decrease in attempted cyber attacks.`,
  },
];

export const highlights = [
  {
    id: "SecureNet",
    story: (skills: string = securitySkills) => [
      `Implemented advanced encryption protocols, reducing security breaches by 60%.`,
      `Conducted regular security audits and penetration tests.`,
      `Collaborated with IT teams to enhance overall system security.`,
    ],
  },
  {
    id: "GuardianTech",
    story: (skills: string = securitySkills) => [
      `Developed comprehensive security strategies using ${skills}.`,
      `Mitigated risks and vulnerabilities, decreasing cyber attacks by 70%.`,
      `Led security training sessions for staff to foster a culture of security awareness.`,
    ],
  },
];
