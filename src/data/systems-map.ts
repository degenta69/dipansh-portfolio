import type { ApprovedClaimId } from './approved-claims';

export type MapNodeState = 'linked' | 'context' | 'pending';

export interface MapArea {
  id: string;
  index: string;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  claimIds: ApprovedClaimId[];
}

export interface MapNode {
  id: string;
  areaId: string;
  label: string;
  detail?: string;
  state: MapNodeState;
  href?: string;
  description: string;
  /** Visible state words. Pending nodes must not rely on colour alone. */
  stateLabel?: string;
  claimIds: ApprovedClaimId[];
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface MapEdge {
  id: string;
  areaId: string;
  from: string;
  to: string;
}

export const MAP_VIEW = { width: 860, height: 600 } as const;

export const mapAreas: MapArea[] = [
  {
    id: 'payments',
    index: '01',
    title: 'Payments',
    x: 12,
    y: 12,
    width: 410,
    height: 250,
    claimIds: ['H3', 'H4-high-level'],
  },
  {
    id: 'commerce',
    index: '02',
    title: 'Commerce workflows',
    x: 438,
    y: 12,
    width: 410,
    height: 250,
    claimIds: ['H3', 'H5'],
  },
  {
    id: 'serverless',
    index: '03',
    title: 'Serverless & events',
    x: 12,
    y: 278,
    width: 410,
    height: 308,
    claimIds: ['H3', 'H6'],
  },
  {
    id: 'open-source',
    index: '04',
    title: 'Open source',
    x: 438,
    y: 278,
    width: 410,
    height: 308,
    claimIds: ['H3', 'H7'],
  },
];

export const mapNodes: MapNode[] = [
  {
    id: 'checkout',
    areaId: 'payments',
    label: 'Checkout',
    state: 'context',
    description:
      'Where a purchase starts. Shown for orientation. Illustrative, not a reconstruction.',
    claimIds: ['H4-high-level'],
    x: 32,
    y: 64,
    width: 118,
    height: 44,
  },
  {
    id: 'payment-service',
    areaId: 'payments',
    label: 'Payment service',
    detail: 'gateway-agnostic',
    state: 'linked',
    href: '/work/payments/#scope',
    description:
      'A gateway-agnostic payment service. High level only. Opens the draft case study.',
    claimIds: ['H4-high-level', 'P1'],
    x: 188,
    y: 58,
    width: 176,
    height: 56,
  },
  {
    id: 'provider-interface',
    areaId: 'payments',
    label: 'Provider interface',
    detail: 'names withheld',
    state: 'context',
    description:
      'Unnamed providers behind one interface. Illustrative. Not a reconstruction.',
    claimIds: ['H4-high-level', 'P-illustrative'],
    x: 188,
    y: 156,
    width: 176,
    height: 56,
  },
  {
    id: 'buyer',
    areaId: 'commerce',
    label: 'Buyer',
    state: 'context',
    description: 'One of the food-ordering apps. Context only. Pre-launch.',
    claimIds: ['H5', 'F1'],
    x: 458,
    y: 58,
    width: 86,
    height: 36,
  },
  {
    id: 'seller',
    areaId: 'commerce',
    label: 'Seller',
    state: 'context',
    description: 'Seller app. Context only. Separate from payments.',
    claimIds: ['H5', 'F1'],
    x: 552,
    y: 58,
    width: 86,
    height: 36,
  },
  {
    id: 'delivery',
    areaId: 'commerce',
    label: 'Delivery',
    state: 'context',
    description: 'Delivery app. Context only.',
    claimIds: ['H5', 'F1'],
    x: 646,
    y: 58,
    width: 92,
    height: 36,
  },
  {
    id: 'admin',
    areaId: 'commerce',
    label: 'Admin',
    state: 'context',
    description: 'Admin app. Context only.',
    claimIds: ['H5', 'F1'],
    x: 746,
    y: 58,
    width: 82,
    height: 36,
  },
  {
    id: 'order-lifecycle',
    areaId: 'commerce',
    label: 'Order lifecycle',
    detail: 'roles · states',
    state: 'linked',
    href: '/work/commerce-workflows/#lifecycle',
    description:
      'Explicit order states shared by each role. Draft. Opens the pre-launch case study.',
    claimIds: ['H5', 'F3'],
    x: 520,
    y: 118,
    width: 196,
    height: 52,
  },
  {
    id: 'realtime-channels',
    areaId: 'commerce',
    label: 'Real-time channels',
    detail: 'per-role rooms',
    state: 'linked',
    href: '/work/commerce-workflows/#realtime',
    description:
      'A channel per role for order updates. Draft, and not a scale claim.',
    claimIds: ['H5', 'F4'],
    x: 520,
    y: 196,
    width: 196,
    height: 52,
  },
  {
    id: 'api-gateway',
    areaId: 'serverless',
    label: 'API Gateway',
    state: 'context',
    description: 'The front door in the sketch. Context only.',
    claimIds: ['H6', 'S1'],
    x: 32,
    y: 332,
    width: 128,
    height: 44,
  },
  {
    id: 'lambda-router',
    areaId: 'serverless',
    label: 'Lambda router',
    detail: 'one function',
    state: 'linked',
    href: '/work/serverless-api/#routing',
    description:
      'One function and a route table. No route count. Opens the draft case study.',
    claimIds: ['H6', 'S1'],
    x: 196,
    y: 326,
    width: 168,
    height: 56,
  },
  {
    id: 'role-authorizer',
    areaId: 'serverless',
    label: 'Role authorizer',
    detail: 'route to roles',
    state: 'linked',
    href: '/work/serverless-api/#authorizer',
    description: 'A separate check from role to allowed routes. Draft.',
    claimIds: ['H6', 'S1'],
    x: 196,
    y: 412,
    width: 168,
    height: 56,
  },
  {
    id: 'sqs-queue',
    areaId: 'serverless',
    label: 'SQS queue',
    state: 'context',
    description:
      'Résumé context only. Not part of the public template, and not linked.',
    claimIds: ['H6', 'R2'],
    x: 32,
    y: 508,
    width: 112,
    height: 40,
  },
  {
    id: 'event-workers',
    areaId: 'serverless',
    label: 'Event workers',
    state: 'context',
    description: 'Résumé context only. No public code is linked.',
    claimIds: ['H6', 'R2'],
    x: 156,
    y: 508,
    width: 130,
    height: 40,
  },
  {
    id: 'schedules',
    areaId: 'serverless',
    label: 'Schedules',
    state: 'context',
    description: 'Résumé context only. No edge joins these to the function.',
    claimIds: ['H6', 'R2'],
    x: 298,
    y: 508,
    width: 108,
    height: 40,
  },
  {
    id: 'diskgod',
    areaId: 'open-source',
    label: 'DiskGod',
    detail: 'real-time chat',
    state: 'pending',
    stateLabel: 'in progress',
    href: '/work/diskgod/#status',
    description:
      'Open-source real-time chat. In progress: hardening is not merged.',
    claimIds: ['H7', 'K1', 'K4'],
    x: 478,
    y: 360,
    width: 250,
    height: 72,
  },
  {
    id: 'lambda-template',
    areaId: 'open-source',
    label: 'Lambda API template',
    detail: 'no repository link',
    state: 'linked',
    href: '/work/serverless-api/',
    description:
      'The same serverless study. Public pattern, with no repository link from this site.',
    claimIds: ['H7', 'S1'],
    x: 478,
    y: 470,
    width: 250,
    height: 56,
  },
];

/** Edges stay inside one area. The four systems are separate. */
export const mapEdges: MapEdge[] = [
  {
    id: 'checkout-service',
    areaId: 'payments',
    from: 'checkout',
    to: 'payment-service',
  },
  {
    id: 'service-provider',
    areaId: 'payments',
    from: 'payment-service',
    to: 'provider-interface',
  },
  {
    id: 'lifecycle-realtime',
    areaId: 'commerce',
    from: 'order-lifecycle',
    to: 'realtime-channels',
  },
  {
    id: 'gateway-router',
    areaId: 'serverless',
    from: 'api-gateway',
    to: 'lambda-router',
  },
  {
    id: 'router-authorizer',
    areaId: 'serverless',
    from: 'lambda-router',
    to: 'role-authorizer',
  },
];

export function nodeById(id: string): MapNode | undefined {
  return mapNodes.find((node) => node.id === id);
}

export function linkedNodes(): MapNode[] {
  return mapNodes.filter((node) => node.href);
}
