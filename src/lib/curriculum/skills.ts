import type { Domain, MasteryState, SkillNode } from "../adaptive/types";
import { createMastery, masteryMean } from "../adaptive/mastery";
import skillsData from "../../../content/skills.json";

const skills = skillsData as SkillNode[];
const byId = new Map(skills.map((s) => [s.id, s]));

export function getAllSkills(): SkillNode[] {
  return skills;
}

export function getSkill(id: string): SkillNode {
  const s = byId.get(id);
  if (!s) throw new Error(`Unknown skill: ${id}`);
  return s;
}

export function getSkillsByDomain(domain: Domain): SkillNode[] {
  return skills.filter((s) => s.domain === domain).sort((a, b) => a.difficulty - b.difficulty);
}

export function prerequisitesMet(
  skillId: string,
  mastery: Record<string, MasteryState>
): boolean {
  const skill = getSkill(skillId);
  return skill.prerequisites.every((p) => {
    const m = mastery[p];
    return m ? masteryMean(m) >= 0.55 : false;
  });
}

export function ensureMasteryMap(
  mastery: Record<string, MasteryState> | undefined
): Record<string, MasteryState> {
  const map: Record<string, MasteryState> = { ...(mastery ?? {}) };
  for (const s of skills) {
    if (!map[s.id]) map[s.id] = createMastery(s.id);
  }
  return map;
}

export function placementProbeSkills(): SkillNode[] {
  // One mid-ladder probe per major strand
  const ids = [
    "read.phoneme.blend",
    "read.phonics.cvc",
    "read.phonics.vowel_teams",
    "read.fluency.short",
    "write.letters.lowercase",
    "write.spelling.cvc",
    "write.sentence.frame",
    "math.number.20",
    "math.placevalue.tens",
    "math.ops.add_100",
    "math.ops.mul_concept",
    "math.word.compare",
  ];
  return ids.map((id) => getSkill(id));
}
