import { describe, expect, it } from 'vitest';

import {
  breadcrumbNode,
  buildGraph,
  collectionPageNode,
  HOME_URL,
  PERSON_ID,
  personNode,
  profilePageNode,
  WEBSITE_ID,
  webPageNode,
  websiteNode,
} from '@/lib/schema';
import {
  AUTHOR_NAME,
  SHARE_IMAGE_DIMENSIONS,
  SHARE_IMAGE_PATH,
  SITE_URL,
} from '@/lib/utils';

describe('personNode', () => {
  it('is a Person with a stable @id', () => {
    const node = personNode();
    expect(node['@type']).toBe('Person');
    expect(node['@id']).toBe(PERSON_ID);
  });

  it('uses author name and split given/family names', () => {
    const node = personNode();
    expect(node.name).toBe(AUTHOR_NAME);
    expect(node.givenName).toBe('Dipansh');
    expect(node.familyName).toBe('Saxena');
  });

  it('omits a portrait and lists the public profiles', () => {
    const node = personNode();
    expect(node.image).toBeUndefined();
    expect(node.sameAs).toEqual(
      expect.arrayContaining(['https://github.com/degenta69']),
    );
  });

  it('omits worksFor while no employer is published, and keeps alumniOf', () => {
    const node = personNode();
    expect(node.worksFor).toBeUndefined();
    expect(node.jobTitle).toBe('SDE-2, Full Stack');
    const alumniOf = node.alumniOf as Record<string, unknown>[];
    expect(alumniOf[0]['@type']).toBe('CollegeOrUniversity');
  });
});

describe('websiteNode', () => {
  it('is a WebSite that points its publisher at the Person', () => {
    const node = websiteNode();
    expect(node['@type']).toBe('WebSite');
    expect(node['@id']).toBe(WEBSITE_ID);
    expect(node.url).toBe(HOME_URL);
    expect((node.publisher as Record<string, unknown>)['@id']).toBe(PERSON_ID);
    const image = node.image as Record<string, unknown>;
    expect(image.url).toBe(`${SITE_URL}${SHARE_IMAGE_PATH}`);
    expect(image.width).toBe(SHARE_IMAGE_DIMENSIONS.width);
    expect(image.height).toBe(SHARE_IMAGE_DIMENSIONS.height);
  });
});

describe('profilePageNode', () => {
  it('is a ProfilePage linked to the site and the Person', () => {
    const node = profilePageNode({ url: HOME_URL, name: 'About' });
    expect(node['@type']).toBe('ProfilePage');
    expect(node['@id']).toBe(`${HOME_URL}#webpage`);
    expect((node.isPartOf as Record<string, unknown>)['@id']).toBe(WEBSITE_ID);
    expect((node.mainEntity as Record<string, unknown>)['@id']).toBe(PERSON_ID);
  });

  it('only references a breadcrumb when requested', () => {
    expect(
      profilePageNode({ url: HOME_URL, name: 'Home' }).breadcrumb,
    ).toBeUndefined();
    const withCrumb = profilePageNode({
      url: `${SITE_URL}/about/`,
      name: 'About',
      hasBreadcrumb: true,
    });
    expect((withCrumb.breadcrumb as Record<string, unknown>)['@id']).toBe(
      `${SITE_URL}/about/#breadcrumb`,
    );
  });
});

describe('collectionPageNode', () => {
  it('is a CollectionPage that is about the Person', () => {
    const node = collectionPageNode({
      url: `${SITE_URL}/writing/`,
      name: 'Writing',
    });
    expect(node['@type']).toBe('CollectionPage');
    expect((node.about as Record<string, unknown>)['@id']).toBe(PERSON_ID);
  });
});

describe('webPageNode', () => {
  it('is a WebPage linked to the site', () => {
    const url = `${SITE_URL}/writing/test-article/`;
    const node = webPageNode({ url, name: 'Test Article Title' });
    expect(node['@type']).toBe('WebPage');
    expect(node['@id']).toBe(`${url}#webpage`);
    expect((node.isPartOf as Record<string, unknown>)['@id']).toBe(WEBSITE_ID);
  });
});

describe('breadcrumbNode', () => {
  it('builds an ordered BreadcrumbList anchored to the page', () => {
    const url = `${SITE_URL}/writing/`;
    const node = breadcrumbNode(url, [
      { name: 'Home', url: HOME_URL },
      { name: 'Writing', url },
    ]);
    expect(node['@type']).toBe('BreadcrumbList');
    expect(node['@id']).toBe(`${url}#breadcrumb`);
    const items = node.itemListElement as Record<string, unknown>[];
    expect(items).toHaveLength(2);
    expect(items[0].position).toBe(1);
    expect(items[1].position).toBe(2);
    expect(items[1].item).toBe(url);
  });
});

describe('buildGraph', () => {
  it('wraps nodes in a schema.org @graph document', () => {
    const graph = buildGraph([websiteNode(), personNode()]);
    expect(graph['@context']).toBe('https://schema.org');
    const nodes = graph['@graph'] as Record<string, unknown>[];
    expect(nodes).toHaveLength(2);
    expect(nodes[0]['@id']).toBe(WEBSITE_ID);
    expect(nodes[1]['@id']).toBe(PERSON_ID);
  });
});
