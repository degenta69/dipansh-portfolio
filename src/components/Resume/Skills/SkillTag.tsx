import type { Skill } from '@/data/resume/skills';

interface SkillTagProps {
  data: Skill;
}

export default function SkillTag({ data }: SkillTagProps) {
  return (
    <span className="skill-tag">
      <span className="skill-tag-name">{data.title}</span>
    </span>
  );
}
