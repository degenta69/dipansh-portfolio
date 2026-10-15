import { describe, expect, it } from 'vitest';

import { categories, skills } from '../resume/skills';

describe('skills data', () => {
  it('exports an array of skills', () => {
    expect(Array.isArray(skills)).toBe(true);
    expect(skills.length).toBeGreaterThan(0);
  });

  it('each skill has a title and categories, and no competency score', () => {
    for (const skill of skills) {
      expect(skill).toHaveProperty('title');
      expect(skill).toHaveProperty('category');
      expect(skill).not.toHaveProperty('competency');
      expect(typeof skill.title).toBe('string');
      expect(Array.isArray(skill.category)).toBe(true);
    }
  });

  it('lists the confirmed tools and nothing outside that set', () => {
    expect(skills.map((skill) => skill.title).sort()).toEqual(
      [
        'AWS Lambda',
        'CI/CD',
        'Docker',
        'EventBridge',
        'Ionic',
        'JavaScript',
        'MongoDB',
        'MQTT',
        'Node.js',
        'Payment integrations',
        'PostgreSQL',
        'React',
        'Redis',
        'REST APIs',
        'SQS',
        'TypeScript',
        'Webhooks',
      ].sort(),
    );
  });

  it('each skill has at least one category', () => {
    for (const skill of skills) {
      expect(skill.category.length).toBeGreaterThanOrEqual(1);
    }
  });

  it('skill categories reference valid category names', () => {
    const categoryNames = categories.map((c) => c.name);

    for (const skill of skills) {
      for (const cat of skill.category) {
        expect(categoryNames).toContain(cat);
      }
    }
  });

  // Data quality: categories should be sorted for consistent UI display
  it('skill categories are sorted alphabetically for UI consistency', () => {
    for (const skill of skills) {
      const sorted = [...skill.category].sort();
      expect(skill.category).toEqual(sorted);
    }
  });
});

describe('categories data', () => {
  it('exports an array of categories', () => {
    expect(Array.isArray(categories)).toBe(true);
    expect(categories.length).toBeGreaterThan(0);
  });

  it('each category has required properties', () => {
    for (const category of categories) {
      expect(category).toHaveProperty('name');
      expect(typeof category.name).toBe('string');
    }
  });

  // Data quality: categories should be sorted for filter button display order
  it('categories are sorted alphabetically by name', () => {
    const names = categories.map((c) => c.name);
    const sorted = [...names].sort();

    expect(names).toEqual(sorted);
  });

  it('all skill categories are represented', () => {
    const usedCategories = new Set(skills.flatMap((s) => s.category));
    const availableCategories = new Set(categories.map((c) => c.name));

    for (const used of usedCategories) {
      expect(availableCategories.has(used)).toBe(true);
    }
  });

  it('has unique category names', () => {
    const names = categories.map((c) => c.name);
    const uniqueNames = new Set(names);

    expect(uniqueNames.size).toBe(names.length);
  });
});
