export const resourceType = resource => ['link', 'document', 'image'].includes(resource.type) ? resource.type : 'link';
export function resourceURL(value) {
  try { const url = new URL(value); return ['http:', 'https:'].includes(url.protocol) ? url.href : null; } catch { return null; }
}
export function resourceSource(resource) {
  try { return new URL(resource.url).hostname.replace(/^www\./, ''); } catch { return 'Saved resource'; }
}
export function findResources(resources, { search = '', type = 'all', tag = '', sort = 'az' } = {}) {
  const terms = search.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  const collator = new Intl.Collator(undefined, { sensitivity: 'base', numeric: true });
  return resources.filter(resource => {
    const text = [resource.title, resource.description, resource.url, ...(resource.tags || [])].filter(Boolean).join(' ').toLocaleLowerCase();
    return (type === 'all' || resourceType(resource) === type) && (!tag || (resource.tags || []).includes(tag)) && terms.every(term => text.includes(term));
  }).sort((a, b) => (sort === 'za' ? -1 : 1) * collator.compare(a.title || '', b.title || '') || String(a.id).localeCompare(String(b.id)));
}
