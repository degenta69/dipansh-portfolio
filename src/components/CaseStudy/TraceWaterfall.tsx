import type { TraceStep } from '@/data/case-studies';

export default function TraceWaterfall({
  steps,
  caption,
}: {
  steps: TraceStep[];
  caption: string;
}) {
  return (
    <figure className="trace">
      <ol className="trace-list">
        {steps.map((step) => (
          <li key={step.label}>
            <span className="trace-label">{step.label}</span>
            <span className="trace-track" aria-hidden="true">
              <span className="trace-bar" style={{ width: `${step.width}%` }} />
            </span>
          </li>
        ))}
      </ol>
      <figcaption>{caption}</figcaption>
    </figure>
  );
}
