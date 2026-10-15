import type { ApprovedClaimId } from './approved-claims';
import slugs from './case-study-slugs.json';

export type OwnershipLevel = 'built' | 'designed' | 'reviewed' | 'unshipped';

export interface ContributionRow {
  feature: string;
  level: OwnershipLevel;
  aiAssisted: boolean;
  notes: string;
  claimIds: ApprovedClaimId[];
}

export interface DiagramSketch {
  caption: string;
  nodes: string[];
}

export interface TraceStep {
  label: string;
  /** Share of the row, 1–100. Illustrative, not a measurement. */
  width: number;
}

export interface Decision {
  decision: string;
  why: string;
  tradeoff: string;
}

export interface CaseSection {
  id: string;
  heading: string;
  paragraphs: string[];
}

export interface CaseStudy {
  slug: string;
  number: string;
  title: string;
  summary: string;
  status: string;
  period: string;
  claimIds: ApprovedClaimId[];
  contributions: ContributionRow[];
  problem: string[];
  sections: CaseSection[];
  diagram: DiagramSketch;
  trace: { caption: string; steps: TraceStep[] };
  decisions: Decision[];
  testing: string[];
  limits: string[];
  aiNote: string;
}

const AI_NOTE =
  'I use AI coding tools (for example Cursor and Claude) daily. Case studies mark where an AI agent did a significant share of the work. I have not confirmed that share for these drafts, so no row is marked AI-assisted.';

export const caseStudies: CaseStudy[] = [
  {
    slug: 'payments',
    number: '01',
    title: 'Payment infrastructure',
    summary:
      'A gateway-agnostic payment service for a multi-product commerce platform, described at a high level.',
    status: 'Draft · pending confirmation',
    period: 'Dates pending confirmation',
    claimIds: ['P1', 'H8', 'P-illustrative'],
    contributions: [
      {
        feature: 'Gateway-agnostic payment service',
        level: 'built',
        aiAssisted: false,
        notes:
          'Draft. I believe I built this service. This page does not describe how it works inside.',
        claimIds: ['P1'],
      },
    ],
    problem: [
      'Checkout should keep working when the provider behind it changes.',
      'This page stops at that idea. It is not a map of a live system.',
    ],
    sections: [
      {
        id: 'scope',
        heading: 'Scope',
        paragraphs: [
          'The service sits behind one interface so checkout does not name a provider. Provider names are withheld.',
          'The food-ordering work is a different system. Nothing on this page connects the two.',
        ],
      },
    ],
    diagram: {
      caption:
        'Illustrative example, not a reconstruction of a production system.',
      nodes: ['Client', 'Payment interface', 'Provider (unnamed)'],
    },
    trace: {
      caption:
        'Illustrative, not measured. The bar widths are a teaching sketch, not latencies.',
      steps: [
        { label: 'Request', width: 100 },
        { label: 'Interface', width: 70 },
        { label: 'Response', width: 46 },
      ],
    },
    decisions: [
      {
        decision: 'Publish only the high-level shape.',
        why: 'The internal design is confidential.',
        tradeoff: 'A reader cannot tell how the service is built.',
      },
      {
        decision: 'Keep this story apart from food ordering.',
        why: 'They are separate systems.',
        tradeoff: 'The map draws no line between the two areas.',
      },
      {
        decision: 'Name no providers.',
        why: 'Permission to name them is not confirmed.',
        tradeoff: 'The third box in the sketch stays unnamed.',
      },
    ],
    testing: [
      'No coverage figure is published.',
      'This draft does not describe the test suite.',
    ],
    limits: [
      'Not a production or scale claim.',
      'Internal payment behaviour is omitted on purpose.',
    ],
    aiNote: AI_NOTE,
  },
  {
    slug: 'commerce-workflows',
    number: '02',
    title: 'Real-time commerce workflows',
    summary:
      'Initial work on a pre-launch food-ordering system: several apps, one order lifecycle, and real-time updates. Separate from the payment service.',
    status: 'Draft · pre-launch',
    period: 'Earlier than the payment work; dates pending confirmation',
    claimIds: ['F1', 'F2', 'F8', 'H8'],
    contributions: [
      {
        feature:
          'Buyer, seller, delivery, and admin apps on one backend, initial contribution only',
        level: 'built',
        aiAssisted: false,
        notes:
          'Draft. The system was later rebuilt by others. This page covers the version I first worked on.',
        claimIds: ['F1', 'F2'],
      },
      {
        feature: 'Order lifecycle shared by each role',
        level: 'built',
        aiAssisted: false,
        notes: 'Draft. Confirm how much of this was mine.',
        claimIds: ['F3'],
      },
      {
        feature: 'Real-time updates on a channel per role',
        level: 'built',
        aiAssisted: false,
        notes: 'Draft. Confirm that I did this work.',
        claimIds: ['F4'],
      },
    ],
    problem: [
      'Several apps needed one picture of an order, with a different view for each role.',
      'The product was not publicly launched. No traffic figures are shown.',
    ],
    sections: [
      {
        id: 'lifecycle',
        heading: 'Order lifecycle',
        paragraphs: [
          'Orders moved through explicit states that each role could read. Access depended on the role.',
          'This is the initial version I worked on, not the later rebuild.',
        ],
      },
      {
        id: 'realtime',
        heading: 'Real-time channels',
        paragraphs: [
          'Status updates were pushed on a separate channel per role instead of polling for every change.',
          'That claim is still a draft. It is not a scale claim.',
        ],
      },
    ],
    diagram: {
      caption:
        'Illustrative example of separate apps around one order. Not a reconstruction, and not connected to the payment service.',
      nodes: ['Buyer', 'Seller', 'Delivery', 'Admin', 'Order'],
    },
    trace: {
      caption: 'Illustrative, not measured.',
      steps: [
        { label: 'Order changes', width: 100 },
        { label: 'Role channel', width: 64 },
        { label: 'App updates', width: 40 },
      ],
    },
    decisions: [
      {
        decision: 'Tell this story apart from payments.',
        why: 'The two systems are not one platform on this site.',
        tradeoff: 'Shared context, if any, is left out.',
      },
      {
        decision: 'Label the work pre-launch.',
        why: 'It was not publicly launched.',
        tradeoff: 'There is nothing here about production traffic.',
      },
      {
        decision: 'Cover only the initial contribution.',
        why: 'The product was later rebuilt by others.',
        tradeoff: 'Later features are out of scope.',
      },
    ],
    testing: ['No test counts are published.'],
    limits: [
      'Pre-launch. No production claim.',
      'Separate from the payment service.',
    ],
    aiNote: AI_NOTE,
  },
  {
    slug: 'serverless-api',
    number: '03',
    title: 'Serverless API architecture',
    summary:
      'A serverless Node.js API: one function, a route table, and a role authorizer. No route count, and no repository link.',
    status: 'Draft · pending confirmation',
    period: 'Dates pending confirmation',
    claimIds: ['S1', 'H8'],
    contributions: [
      {
        feature: 'Route table inside one function',
        level: 'built',
        aiAssisted: false,
        notes:
          'Draft. Tests are not claimed. This site does not link to a repository.',
        claimIds: ['S1'],
      },
      {
        feature: 'Role authorizer',
        level: 'built',
        aiAssisted: false,
        notes:
          'Draft. Roles map to allowed routes. No count of routes is stated.',
        claimIds: ['S1'],
      },
    ],
    problem: [
      'A small HTTP API can live in one function if the route table and the role check stay separate.',
      'The public wording is "serverless Node.js API". It does not include a route count.',
    ],
    sections: [
      {
        id: 'routing',
        heading: 'Routing',
        paragraphs: [
          'One function looks up the path and calls a handler. That is the whole public description of routing.',
        ],
      },
      {
        id: 'authorizer',
        heading: 'Role authorizer',
        paragraphs: [
          'A separate check maps a role to the routes it may call.',
          'Queues and schedules from other work sit on the résumé. They are not part of this template, and the map does not connect them to it.',
        ],
      },
    ],
    diagram: {
      caption:
        'Illustrative example of a single function and a role check. Not a reconstruction of a private API.',
      nodes: ['Request', 'Function', 'Role check'],
    },
    trace: {
      caption: 'Illustrative, not measured.',
      steps: [
        { label: 'Request', width: 100 },
        { label: 'Role check', width: 58 },
        { label: 'Handler', width: 72 },
      ],
    },
    decisions: [
      {
        decision: 'State no route count.',
        why: 'Published numbers for this work do not agree, and none is approved.',
        tradeoff: 'The page cannot say how large the API is.',
      },
      {
        decision: 'Link no repository.',
        why: 'Ownership and cleanup are not closed.',
        tradeoff: 'A reader cannot open the code from this site.',
      },
      {
        decision: 'Do not claim tests.',
        why: 'A test suite is not established for the public template.',
        tradeoff: 'The testing section stays empty of numbers.',
      },
    ],
    testing: ['Tests are not claimed.'],
    limits: [
      'No repository link.',
      'Event queues on the résumé are a different note, not this template.',
    ],
    aiNote: AI_NOTE,
  },
  {
    slug: 'diskgod',
    number: '04',
    title: 'DiskGod',
    summary:
      'An open-source real-time chat app. Hardening is not merged, so this page does not describe it as done.',
    status: 'In progress · not merged',
    period: 'Ongoing',
    claimIds: ['K1', 'K4', 'H8'],
    contributions: [
      {
        feature: 'Real-time chat application',
        level: 'built',
        aiAssisted: false,
        notes:
          'Draft. MongoDB, Express, React, and Node.js. This site does not link to the repository.',
        claimIds: ['K1'],
      },
      {
        feature:
          'Member checks, history pagination, and socket handshake authentication',
        level: 'unshipped',
        aiAssisted: false,
        notes: 'Not built or not merged. Not described as implemented.',
        claimIds: ['K4'],
      },
    ],
    problem: [
      'People in a chat should only read and send messages for chats they belong to, and the server should know who they are without trusting the client.',
      'That work is not merged. This page names the gap and stops.',
    ],
    sections: [
      {
        id: 'status',
        heading: 'What is not done',
        paragraphs: [
          'Membership checks, cursor pagination, and authenticating the socket at the handshake are in progress.',
          'Until they are merged and tested, they are not part of what this site says I shipped.',
        ],
      },
    ],
    diagram: {
      caption:
        'Illustrative example of a client talking to a chat server. Not a diagram of the unfinished security work.',
      nodes: ['Client', 'Chat server'],
    },
    trace: {
      caption: 'Illustrative, not measured. No security fix is drawn here.',
      steps: [
        { label: 'Client', width: 100 },
        { label: 'Server', width: 70 },
      ],
    },
    decisions: [
      {
        decision: 'Mark the page in progress.',
        why: 'The hardening work is not merged.',
        tradeoff: 'The map node stays amber and says so in text.',
      },
      {
        decision: 'Do not describe the unfinished fix.',
        why: 'An unmerged change is not an implementation claim.',
        tradeoff: 'There is no walkthrough of the socket handshake.',
      },
      {
        decision: 'Link no repository.',
        why: 'The security work is still open.',
        tradeoff: 'The code is not one click away.',
      },
    ],
    testing: [
      'No test run is claimed for the unmerged work.',
      'The published package script is not described as a real suite.',
    ],
    limits: [
      'In progress. Not a finished security write-up.',
      'No repository link.',
    ],
    aiNote: AI_NOTE,
  },
];

const bySlug = new Map(caseStudies.map((study) => [study.slug, study]));

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return bySlug.get(slug);
}

export function caseStudyParams(): { slug: string }[] {
  return slugs.map((slug) => ({ slug }));
}

export { slugs as caseStudySlugs };
