import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';
import { describe, expect, it } from 'vitest';

interface Step {
  uses?: string;
  run?: string;
  env?: Record<string, string>;
  with?: Record<string, unknown>;
}

interface Job {
  permissions?: Record<string, string> | string;
  env?: Record<string, string>;
  steps?: Step[];
}

interface Workflow {
  permissions?: Record<string, string> | string;
  env?: Record<string, string>;
  jobs: Record<string, Job>;
}

const directory = join(process.cwd(), '.github/workflows');
const workflows = readdirSync(directory)
  .filter((name) => /\.ya?ml$/.test(name))
  .map((name) => {
    const yaml = readFileSync(join(directory, name), 'utf8');
    // Reuse the YAML parser already used for post frontmatter.
    const workflow = matter(`---\n${yaml}\n---`).data as Workflow;
    return { name, workflow };
  });

describe.each(workflows)('$name credential boundaries', ({ workflow }) => {
  it('pins every external action to a full commit SHA', () => {
    for (const job of Object.values(workflow.jobs)) {
      for (const step of job.steps ?? []) {
        if (step.uses) {
          expect(step.uses).toMatch(/^[\w./-]+@[a-f0-9]{40}$/);
        }
      }
    }
  });

  it('removes checkout authentication before repository code executes', () => {
    for (const job of Object.values(workflow.jobs)) {
      for (const step of job.steps ?? []) {
        if (step.uses?.startsWith('actions/checkout@')) {
          expect(step.with?.['persist-credentials']).toBe(false);
        }
      }
    }
  });

  it('does not deploy and keeps every permission read-only', () => {
    expect(workflow.jobs.deploy).toBeUndefined();
    expect(workflow.permissions).toEqual({ contents: 'read' });
    for (const job of Object.values(workflow.jobs)) {
      const permissions = job.permissions ?? workflow.permissions;
      expect(typeof permissions).toBe('object');
      expect(permissions).not.toHaveProperty('pages');
      expect(Object.values(permissions ?? {})).not.toContain('write');
      expect(JSON.stringify([workflow.env, job.env, job.steps])).not.toMatch(
        /\$\{\{\s*(?:secrets[.\[]|github\.token)/,
      );
      expect(JSON.stringify(job.steps ?? [])).not.toMatch(
        /configure-pages|deploy-pages|NEXT_PUBLIC_GA_TRACKING_ID/,
      );
    }
  });
});
