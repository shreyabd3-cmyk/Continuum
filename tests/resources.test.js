import test from 'node:test';
import assert from 'node:assert/strict';
import { findResources, resourceType, resourceSource, resourceURL } from '../src/workspace/resources.js';
const resources = [
  { id: 'b', title: 'Sitemap 10', type: 'link', url: 'https://figma.com/alpha', description: 'Approved navigation', tags: ['UX', 'Project Doc'] },
  { id: 'a', title: 'Content audit', type: 'document', url: 'https://docs.google.com/a', description: 'Inventory spreadsheet', tags: ['Project Doc'] },
  { id: 'c', title: 'Sitemap 2', type: 'image', url: 'https://example.com/mock.png', tags: ['Inspiration'] },
];
test('resource search matches title, description, URL and tags without case sensitivity', () => {
  for (const search of ['SITEMAP 10', 'approved', 'figma.com', 'UX']) assert.deepEqual(findResources(resources, { search }).map(r => r.id), ['b']);
});
test('type, tag and every search term are combined', () => {
  assert.deepEqual(findResources(resources, { type: 'document', tag: 'Project Doc', search: 'audit spreadsheet' }).map(r => r.id), ['a']);
  assert.equal(findResources(resources, { type: 'image', tag: 'Project Doc' }).length, 0);
  assert.equal(findResources(resources, { search: 'content nonexistent' }).length, 0);
});
test('sort is natural alphabetical, reversible, and does not mutate stored resource order', () => {
  assert.deepEqual(findResources(resources).map(r => r.id), ['a', 'c', 'b']);
  assert.deepEqual(findResources(resources, { sort: 'za' }).map(r => r.id), ['b', 'c', 'a']);
  assert.deepEqual(resources.map(r => r.id), ['b', 'a', 'c']);
});
test('empty, legacy and untagged resources remain usable', () => {
  assert.deepEqual(findResources([]), []);
  assert.equal(resourceType({}), 'link');
  assert.equal(findResources([{ id: 'old', title: 'Legacy resource', url: 'https://example.com' }], { type: 'link' }).length, 1);
  assert.equal(resourceSource({ url: 'https://www.example.com/a' }), 'example.com');
  assert.equal(resourceSource({ url: 'invalid' }), 'Saved resource');
});
test('external links allow web protocols and reject unsafe or invalid URLs', () => {
  assert.equal(resourceURL('https://example.com'), 'https://example.com/');
  for (const value of ['javascript:alert(1)', 'data:text/html,hello', 'not-a-url', undefined]) assert.equal(resourceURL(value), null);
});
