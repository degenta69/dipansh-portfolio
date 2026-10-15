/** Based on the JSON Resume work item. Dates only; no year totals. */
export interface Position {
  name: string;
  position: string;
  url?: string;
  startDate: string;
  endDate?: string;
  commitment?: 'part-time';
  summary?: string;
  highlights?: string[];
}

/**
 * Role areas only. Company names and company sites stay out of this file.
 */
const work: Position[] = [
  {
    name: 'Payment and commerce systems',
    position: 'SDE-2, Full Stack',
    startDate: '2026-02-01',
    summary:
      'Payment, marketplace, and real-time product systems. Draft pending confirmation.',
    highlights: [
      'Built a gateway-agnostic payment service for a multi-product commerce platform. The public description stays high level.',
      'Earlier, and separately, worked on a pre-launch multi-application food ordering system. That work is not the payment service.',
    ],
  },
  {
    name: 'Event-driven services',
    position: 'Software Engineer, Full Stack',
    startDate: '2022-05-01',
    endDate: '2026-01-01',
    summary:
      'Event-driven services and a serverless Node.js API. Draft pending confirmation. No workload figures are shown.',
    highlights: [
      'Built event-driven services on AWS Lambda, SQS, and EventBridge, plus scheduled jobs.',
      'Built a serverless Node.js API. No route count is stated.',
      'Set up CI/CD.',
    ],
  },
  {
    name: 'Interface work',
    position: 'React.js Intern',
    startDate: '2021-12-01',
    endDate: '2022-05-01',
    summary:
      'Built responsive React interfaces and integrated backend APIs. Draft pending confirmation.',
  },
];

export default work;
