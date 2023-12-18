import { shuffle } from "lodash-es";

export const heading = (text: string) => ({
  type: "heading-2",
  id: `heading-for-${text}`,
  props: {
    value: text,
  },
});

export const getSkillsOverlap = (skills: string[], jobSkills: string[]) => {
  // Helper function to check if a skill is an exact match.
  const isExactMatch = (skill: string, jobSkill: string) =>
    skill.toLowerCase().trim() === jobSkill.toLowerCase().trim();

  // Find exact matches first.
  let exactMatches = skills.filter((skill) =>
    jobSkills.some((jobSkill) => isExactMatch(skill, jobSkill))
  );

  // Find partial matches, excluding the exact matches.
  let partialMatches = skills.filter((skill) =>
    jobSkills.some(
      (jobSkill) =>
        (jobSkill.toLowerCase().includes(skill.toLowerCase().trim()) ||
          skill.toLowerCase().trim().includes(jobSkill.toLowerCase())) &&
        !exactMatches.includes(skill)
    )
  );

  // Combine exact and partial matches.
  let combinedMatches = [...exactMatches, ...partialMatches];

  // Shuffle and fill the array if there are less than 7 skills.
  if (combinedMatches.length < 7) {
    let shuffledSkills = shuffle(skills);
    for (let skill of shuffledSkills) {
      if (!combinedMatches.includes(skill)) {
        combinedMatches.push(skill);
        if (combinedMatches.length === 7) break;
      }
    }
  }

  return combinedMatches.join(", ");
};
