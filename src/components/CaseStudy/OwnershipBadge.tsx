import type { OwnershipLevel } from '@/data/case-studies';

const LABEL: Record<OwnershipLevel, string> = {
  built: 'Built',
  designed: 'Designed (and partly built)',
  reviewed: 'Reviewed',
  unshipped: 'Not built yet',
};

export default function OwnershipBadge({
  level,
  ai,
}: {
  level: OwnershipLevel;
  ai?: boolean;
}) {
  return (
    <span className={`ownership ownership--${level}`}>
      {LABEL[level]}
      {ai ? <span className="ownership-ai">AI-assisted</span> : null}
    </span>
  );
}
