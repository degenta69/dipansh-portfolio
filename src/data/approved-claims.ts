/**
 * Draft-safe claim ids this site is allowed to cite.
 *
 * The 15 Oct 2026 checklist was not ticked. Approval that day, plus the
 * instruction to ship safe placeholder copy, is what admits an id. An id
 * absent from this list must not appear on a map node or a contribution row.
 * Everything that uses one is still a draft pending confirmation.
 */
export const APPROVED_CLAIMS = [
  'G1',
  'G2',
  'G4',
  'G5',
  'H1',
  'H2',
  'H3',
  'H4-high-level',
  'H5',
  'H6',
  'H7',
  'H8',
  'P1',
  'P-illustrative',
  'F1',
  'F2',
  'F3',
  'F4',
  'F8',
  'S1',
  'K1',
  'K4',
  'AB1',
  'AB2',
  'AB3',
  'AB4',
  'R0',
  'R0a',
  'R0-high-level',
  'R0c',
  'R1',
  'R2',
  'R3',
  'R4',
  'R11',
  'R12',
  'R13',
  'SK1',
  'SK2',
  'SK3',
  'SK4',
  'SK5',
  'SK6',
  'SK7',
  'SK8',
  'SK9',
] as const;

export type ApprovedClaimId = (typeof APPROVED_CLAIMS)[number];

const APPROVED = new Set<string>(APPROVED_CLAIMS);

export function isApprovedClaim(id: string): boolean {
  return APPROVED.has(id);
}
