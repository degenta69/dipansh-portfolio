import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

import { APPROVED_CLAIMS, isApprovedClaim } from '@/data/approved-claims';
import { caseStudies } from '@/data/case-studies';
import { mapAreas, mapEdges, mapNodes } from '@/data/systems-map';

const ROOTS = ['src/data', 'app', 'content', 'public'];
const TEXT = new Set([
  '.ts',
  '.tsx',
  '.js',
  '.mjs',
  '.css',
  '.json',
  '.md',
  '.txt',
  '.html',
  '.xml',
]);

function filesIn(directory: string): string[] {
  let entries;
  try {
    entries = readdirSync(directory, { withFileTypes: true });
  } catch {
    return [];
  }
  return entries.flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return filesIn(path);
    const dot = entry.name.lastIndexOf('.');
    const ext = dot === -1 ? '' : entry.name.slice(dot);
    return TEXT.has(ext) ? [path] : [];
  });
}

const banned = [
  ['Kanz', 'Pay'].join(''),
  ['Foo', 'yum'].join(''),
  ['engage', 'music'].join(''),
  ['menu', ' scan'].join(''),
  ['Safe', 'Gold'].join(''),
  ['N-', 'Genius'].join(''),
  ['Try', 'Spare'].join(''),
  ['MB', 'ME'].join(''),
  ['Mic', 'hael', " D'", 'Angelo'].join(''),
  ['dangelo', 'saurus'].join(''),
  ['hi@', 'mld', 'angelo'].join(''),
  ['mld', 'angelo'].join(''),
  ['Prompt', 'foo'].join(''),
  ['Open', 'AI'].join(''),
  ['react-', 'bits'].join(''),
  ['acer', 'nity'].join(''),
  ['No', 'ida'].join(''),
  ['100+', ' route'].join(''),
  ['65+', ' route'].join(''),
  ['80', '%'].join(''),
];

describe('public content guard', () => {
  const corpus = ROOTS.flatMap((root) => filesIn(join(process.cwd(), root)))
    .filter(
      (path) => !path.includes('__tests__') && !/\.test\.tsx?$/.test(path),
    )
    .map((path) => ({ path, text: readFileSync(path, 'utf8') }));

  it('rejects banned names, metrics, and upstream identity in public copy', () => {
    const hits: string[] = [];
    for (const { path, text } of corpus) {
      for (const term of banned) {
        if (text.includes(term)) hits.push(`${path}: ${term}`);
      }
      if (new RegExp(`\\b${['Kaf', 'ka'].join('')}\\b`).test(text)) {
        hits.push(`${path}: queue-product`);
      }
      if (new RegExp(`\\b${['Kuber', 'netes'].join('')}\\b`).test(text)) {
        hits.push(`${path}: orchestrator`);
      }
      if (new RegExp(`\\b${['Graph', 'QL'].join('')}\\b`).test(text)) {
        hits.push(`${path}: query-language`);
      }
      if (new RegExp(`\\b${['Le', 'an'].join('')}\\b`).test(text)) {
        hits.push(`${path}: provider`);
      }
      if (/\+91[\s-]?\d/.test(text)) hits.push(`${path}: phone`);
      if (/\b\d{3}-\d{3}-\d{4}\b/.test(text)) hits.push(`${path}: phone`);
    }
    expect(hits).toEqual([]);
  });

  it('does not vendor animation libraries', () => {
    for (const name of [
      ['react-', 'bits'].join(''),
      ['acer', 'nity'].join(''),
    ]) {
      expect(() => statSync(join(process.cwd(), name))).toThrow();
    }
  });
});

describe('approved claims', () => {
  it('only cites ids on the allowlist', () => {
    for (const id of APPROVED_CLAIMS) {
      expect(isApprovedClaim(id)).toBe(true);
    }
    for (const node of [...mapNodes, ...mapAreas]) {
      expect(node.claimIds.length).toBeGreaterThan(0);
      for (const id of node.claimIds) expect(isApprovedClaim(id)).toBe(true);
    }
    for (const study of caseStudies) {
      expect(study.claimIds.length).toBeGreaterThan(0);
      for (const row of study.contributions) {
        expect(row.claimIds.length).toBeGreaterThan(0);
        for (const id of [...study.claimIds, ...row.claimIds]) {
          expect(isApprovedClaim(id)).toBe(true);
        }
      }
    }
  });

  it('keeps map edges inside a single area', () => {
    for (const edge of mapEdges) {
      const from = mapNodes.find((node) => node.id === edge.from);
      const to = mapNodes.find((node) => node.id === edge.to);
      expect(from?.areaId).toBe(edge.areaId);
      expect(to?.areaId).toBe(edge.areaId);
    }
  });
});
