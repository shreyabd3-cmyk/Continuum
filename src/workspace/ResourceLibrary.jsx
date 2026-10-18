import Select from "../components/Select";
import React, { useState } from 'react';
import { Search, Plus, X, List, LayoutGrid, Link, FileText, Image, ExternalLink, MoreHorizontal, Pencil, Trash2, ChevronDown, FolderSearch } from 'lucide-react';
import { findResources, resourceType, resourceSource, resourceURL } from './resources';
import './resources.css';

const TYPE_LABELS = { link: 'Link', document: 'Document', image: 'Image' };
function ResourceItem({ resource, gallery, onEdit, onDelete, isDemo }) {
  const [expanded, setExpanded] = useState(false);
  const kind = resourceType(resource), Icon = kind === 'image' ? Image : kind === 'document' ? FileText : Link;
  const url = resourceURL(resource.url), preview = resourceURL(kind === 'image' ? resource.url : resource.preview?.image);
  return <li className={`resource-item ${expanded ? 'expanded' : ''}`}>
    {gallery && <div className="resource-thumbnail"><Icon size={28} aria-hidden="true" />{preview && <img src={preview} alt="" loading="lazy" onError={e => { e.currentTarget.hidden = true; }} />}</div>}
    <div className="resource-item-main">
      {!gallery && <span className={`resource-kind ${kind}`}><Icon size={20} aria-hidden="true" /></span>}
      <div className="resource-item-copy">
        {url ? <a className="resource-title" href={url} target="_blank" rel="noopener noreferrer" title={`${resource.title} — opens in a new tab`}>{resource.title || 'Untitled resource'}<ExternalLink size={14} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a> : <span className="resource-title">{resource.title || 'Untitled resource'}</span>}
        <div className="resource-metadata"><span>{resourceSource(resource)}</span><span aria-hidden="true">·</span><span>{TYPE_LABELS[kind]}</span></div>
        <div className="resource-tags">{(resource.tags || []).slice(0, expanded ? undefined : 2).map(tag => <span key={tag}>{tag}</span>)}{!expanded && resource.tags?.length > 2 && <span title={resource.tags.slice(2).join(', ')}>+{resource.tags.length - 2}</span>}</div>
      </div>
      <div className="resource-item-actions">
        <button className="resource-details-toggle" aria-label={`${expanded ? 'Hide' : 'Show'} details for ${resource.title}`} aria-expanded={expanded} onClick={() => setExpanded(value => !value)}><ChevronDown size={18} /></button>
        {<details className="resource-more" onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget)) e.currentTarget.open = false; }} onKeyDown={e => { if (e.key === 'Escape') { e.currentTarget.open = false; e.currentTarget.querySelector('summary')?.focus(); } }}>
          <summary aria-label={`Actions for ${resource.title}`} title="Resource actions"><MoreHorizontal size={20} /></summary>
          <div className="resource-action-menu"><button onClick={e => { e.currentTarget.closest('details').open = false; onEdit(resource); }}><Pencil size={16} />Edit resource</button><button className="resource-delete" onClick={e => { e.currentTarget.closest('details').open = false; if (window.confirm(`Delete “${resource.title}”?`)) onDelete(resource.id); }}><Trash2 size={16} />Delete resource</button></div>
        </details>}
      </div>
    </div>
    {expanded && <div className="resource-expanded"><p>{resource.description || 'No description added yet.'}</p>{url ? <a href={url} target="_blank" rel="noopener noreferrer">{resource.url}<ExternalLink size={14} /><span className="sr-only"> (opens in a new tab)</span></a> : <p>This resource needs a valid web address. Edit it to update the link.</p>}{!gallery && preview && <img src={preview} alt={`Preview of ${resource.title}`} loading="lazy" onError={e => { e.currentTarget.hidden = true; }} />}</div>}
  </li>;
}
export default function ResourceLibrary({ resources = [], onAdd, onEdit, onDelete, isDemo }) {
  const [search, setSearch] = useState(''), [type, setType] = useState('all'), [tag, setTag] = useState(''), [sort, setSort] = useState('az'), [view, setView] = useState('list');
  const tags = [...new Set(resources.flatMap(resource => resource.tags || []))].sort((a, b) => a.localeCompare(b));
  const filtered = findResources(resources, { search, type, tag, sort });
  const hasFilters = !!search.trim() || type !== 'all' || !!tag;
  const reset = () => { setSearch(''); setType('all'); setTag(''); };
  return <section className="resource-library" aria-labelledby="resource-library-title">
    <header className="resource-library-heading"><div><h2 id="resource-library-title">Resources <span className="ws-count">{resources.length}</span></h2><p>Your links, documents, and inspiration. Easy to find again.</p></div><button className="ws-primary" onClick={onAdd}><Plus size={18} />Add resource</button></header>
    <label className="resource-search"><Search size={20} aria-hidden="true" /><input aria-label="Search resources" type="search" placeholder="Search titles, descriptions, links, or tags" value={search} onChange={e => setSearch(e.target.value)} />{search && <button aria-label="Clear resource search" onClick={() => setSearch('')}><X size={18} /></button>}</label>
    <div className="resource-toolbar"><div className="resource-filter-fields"><label><span>Type</span><Select aria-label="Filter resources by type" value={type} onChange={e => setType(e.target.value)}><option value="all">All types</option><option value="link">Links</option><option value="document">Documents</option><option value="image">Images</option></Select></label><label><span>Tag</span><Select aria-label="Filter resources by tag" value={tag} onChange={e => setTag(e.target.value)}><option value="">All tags</option>{tags.map(value => <option key={value} value={value}>{value}</option>)}</Select></label></div>
      <div className="resource-display-fields"><label><span>Sort</span><Select aria-label="Sort resources" value={sort} onChange={e => setSort(e.target.value)}><option value="az">Title A–Z</option><option value="za">Title Z–A</option></Select></label><div className="resource-view-toggle" role="group" aria-label="Resource layout"><button aria-label="List view" title="List view" aria-pressed={view === 'list'} onClick={() => setView('list')}><List size={20} /></button><button aria-label="Gallery view" title="Gallery view" aria-pressed={view === 'gallery'} onClick={() => setView('gallery')}><LayoutGrid size={20} /></button></div></div>
    </div>
    <div className="resource-results"><span role="status" aria-live="polite">{hasFilters ? `${filtered.length} of ${resources.length}` : resources.length} {resources.length === 1 ? 'resource' : 'resources'}{hasFilters ? ' match' : ''}</span>{hasFilters && <button onClick={reset}><X size={14} />Clear filters</button>}</div>
    {filtered.length ? <ul className={`resource-collection resource-${view}`} aria-label="Saved resources">{filtered.map(resource => <ResourceItem key={resource.id} resource={resource} gallery={view === 'gallery'} onEdit={onEdit} onDelete={onDelete} isDemo={isDemo} />)}</ul> : <div className="resource-empty"><FolderSearch size={32} /><h3>{resources.length ? 'No resources match yet.' : 'A home for your project resources.'}</h3><p>{resources.length ? 'Try a different search, type, or tag—or clear the filters.' : 'Save a link, document, or image so it’s ready when you need it.'}</p>{hasFilters && <button className="ws-secondary" onClick={reset}>Clear filters</button>}</div>}
  </section>;
}
