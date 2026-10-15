/**
 * Case studies, plus an archive that links nowhere off the site.
 * No project repository URLs.
 */
export type ProjectStatus = 'shipped' | 'archive';

export interface Project {
  title: string;
  subtitle?: string;
  link?: string;
  sourceWork?: string;
  image?: string;
  date: string;
  endDate?: string;
  ongoing?: boolean;
  desc: string;
  tech?: string[];
  status: ProjectStatus;
}

const data: Project[] = [
  {
    title: 'Payment infrastructure',
    subtitle: 'Draft · high level only',
    link: '/work/payments/',
    sourceWork: 'Payment and commerce systems',
    date: '2026-02-01',
    ongoing: true,
    desc: 'A gateway-agnostic payment service for a multi-product commerce platform. Internal flows are not described.',
    status: 'shipped',
  },
  {
    title: 'Real-time commerce workflows',
    subtitle: 'Draft · pre-launch · separate from payments',
    link: '/work/commerce-workflows/',
    sourceWork: 'Payment and commerce systems',
    date: '2026-02-01',
    ongoing: true,
    desc: 'Initial work on a multi-application food ordering system. Not publicly launched.',
    status: 'shipped',
  },
  {
    title: 'Serverless API architecture',
    subtitle: 'Draft · no repository link',
    link: '/work/serverless-api/',
    sourceWork: 'Event-driven services',
    date: '2022-05-01',
    endDate: '2026-01-01',
    desc: 'A serverless Node.js API. No route count is stated.',
    status: 'shipped',
  },
  {
    title: 'DiskGod',
    subtitle: 'In progress · draft',
    link: '/work/diskgod/',
    date: '2026-01-01',
    ongoing: true,
    desc: 'Open-source real-time chat. Hardening is not merged, and this page does not link to a repository.',
    status: 'archive',
  },
  {
    title: 'Earlier learning projects',
    subtitle: 'Held back',
    date: '2021-06-01',
    endDate: '2021-11-01',
    desc: 'Student-era experiments stay off this page until each one is reviewed. Nothing here links to a repository.',
    status: 'archive',
  },
];

export const shipped = data.filter((project) => project.status === 'shipped');
export const archive = data.filter((project) => project.status === 'archive');

export default data;
