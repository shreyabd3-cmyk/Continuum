import FormDialog, { Field, useDialogForm } from "../components/FormDialog";
import Select from "../components/Select";
import ProjectIcon from "../components/ProjectIcon";
import { projectAppearance } from "./projectAppearance";
import React, { useState, useEffect, useRef } from 'react';
import { Plus, Search, Play, Pause, RotateCcw, Target, ArrowUpRight, Pencil, Trash2, Check, X, Clock, Minimize2, Maximize2 } from 'lucide-react';
import { DURATIONS, localDate, newTimer, progress, remaining, statistics, resumeTimer, pauseTimer } from './model';
import './workspace.css';
import './material.css';

export function TaskEditor({ projects, task, projectId, onSave, onClose, busy, error }) {
  const form = useDialogForm({ title: task?.title || '', projectId: task?.projectId || projectId || projects[0]?.id || '', dueDate: task?.dueDate || '' }, values => {
    const issues = {};
    if (!values.title.trim()) issues.title = 'Enter a task name.';
    if (!projects.some(project => project.id === values.projectId)) issues.projectId = 'Choose a project for this task.';
    if (values.dueDate && !/^\d{4}-\d{2}-\d{2}$/.test(values.dueDate)) issues.dueDate = 'Choose a valid due date.';
    return issues;
  }, values => onSave({ ...task, ...values, title: values.title.trim() }), onClose);
  return <FormDialog title={task ? 'Edit task' : 'Add task'} description="Make the next action clear and manageable. Fields marked * are required." onClose={onClose} onSubmit={form.submit} busy={form.busy || busy} error={form.formError || error} submitLabel={task ? 'Save changes' : 'Add task'}>
    <Field label="Task name" required autoFocus value={form.values.title} maxLength={300} placeholder="e.g. Review navigation prototype" onChange={e => form.setValue('title', e.target.value)} onBlur={() => form.blur('title')} error={form.error('title')} />
    <Field label="Project" required error={form.error('projectId')}><Select value={form.values.projectId} onChange={e => form.setValue('projectId', e.target.value)} onBlur={() => form.blur('projectId')}><option value="" disabled>Choose a project</option>{projects.map(project => <option key={project.id} value={project.id}>{project.title}</option>)}</Select></Field>
    <Field label="Due date" type="date" value={form.values.dueDate} onChange={e => form.setValue('dueDate', e.target.value)} onBlur={() => form.blur('dueDate')} error={form.error('dueDate')} hint="Leave this empty for tasks without a deadline." />
    <div className="ds-date-shortcuts" aria-label="Quick due dates">{[[0, 'Today'], [1, 'Tomorrow'], [7, 'In a week']].map(([offset, label]) => <button key={label} className="ds-chip" type="button" onClick={() => { const date = new Date(); date.setDate(date.getDate() + offset); form.setValue('dueDate', localDate(date)); }}>{label}</button>)}<button className="ds-chip" type="button" onClick={() => form.setValue('dueDate', '')}>No date</button></div>
  </FormDialog>;
}
export function TaskRows({ tasks, projects, workspace, onEdit, onFocus, showProject = false }) {
  const today = localDate(Date.now());
  return <div className="task-list">{tasks.map(task => <div className={`task-row ${task.completed ? 'is-complete' : ''}`} key={task.id}>
    <input aria-label={`Complete ${task.title}`} type="checkbox" checked={task.completed} disabled={workspace.busy} onChange={() => workspace.saveTask({ ...task, completed: !task.completed, completedAt: task.completed ? null : Date.now() })} />
    <div className="task-copy"><strong>{task.title}</strong><div>{showProject && <span>{projects.find(p => p.id === task.projectId)?.title || 'Deleted project'}</span>}{task.dueDate && <span className={!task.completed && task.dueDate < today ? 'overdue' : ''}>{task.dueDate < today && !task.completed ? 'Overdue · ' : ''}{new Date(`${task.dueDate}T00:00:00`).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>}</div></div>
    <div className="task-actions">{!task.completed && <button title="Focus on this task" aria-label={`Focus on ${task.title}`} onClick={() => onFocus(task.projectId, task.id)}><Target size={16} /></button>}<button aria-label={`Edit ${task.title}`} title="Edit task" onClick={() => onEdit(task)}><Pencil size={18} /></button><button disabled={workspace.busy} title="Delete task" aria-label={`Delete ${task.title}`} onClick={() => { if (window.confirm(`Delete “${task.title}”?`)) workspace.removeTask(task); }}><Trash2 size={18} /></button></div>
  </div>)}</div>;
}
export function NextSteps({ project, projects, workspace, onEdit, onAdd, onFocus }) {
  const [filter, setFilter] = useState('open');
  const tasks = workspace.tasks.filter(t => t.projectId === project.id), stats = progress(tasks);
  const filtered = tasks.filter(t => filter === 'all' || (filter === 'completed' ? t.completed : !t.completed)).sort((a, b) => (a.dueDate || '9999').localeCompare(b.dueDate || '9999'));
  return <section className="ws-card next-steps"><div className="ws-section-heading"><div><p className="ws-eyebrow">{project.title}</p><h2>Tasks</h2><p>{stats.completed} of {stats.total} completed</p></div><button className="ws-primary" onClick={() => onAdd(project.id)}><Plus size={16} /> Add task</button></div><div className="ws-progress" aria-label={`${stats.percent}% complete`}><span style={{ width: `${stats.percent}%` }} /></div><div className="ws-filters">{['open', 'completed', 'all'].map(value => <button key={value} aria-pressed={filter === value} onClick={() => setFilter(value)}>{value[0].toUpperCase() + value.slice(1)}</button>)}</div>
    {filtered.length ? <TaskRows tasks={filtered} projects={projects} workspace={workspace} onEdit={onEdit} onFocus={onFocus} /> : <div className="ws-empty"><Check size={24} /><h3>{filter === 'completed' ? 'No completed tasks yet.' : 'No open tasks.'}</h3><p>{filter === 'completed' ? 'Complete a task to see it here.' : 'Add a task to plan what to do next.'}</p></div>}
  </section>;
}
export function Dashboard({ projects, workspace, onOpen, onAdd, onNewProject, onEdit, onFocus }) {
  const [search, setSearch] = useState(''), [status, setStatus] = useState('active');
  const stats = statistics(workspace.tasks, workspace.sessions, workspace.now), term = search.toLowerCase();
  const matches = projects.filter(p => (p.status || 'active') === status && `${p.title} ${p.description || ''} ${workspace.tasks.filter(t => t.projectId === p.id).map(t => t.title).join(' ')}`.toLowerCase().includes(term));
  const projectIds = new Set(projects.filter(p => p.status !== 'completed').map(p => p.id));
  const horizon = new Date(workspace.now); horizon.setDate(horizon.getDate() + 7);
  const radar = workspace.tasks.filter(t => !t.completed && projectIds.has(t.projectId) && t.dueDate && t.dueDate <= localDate(horizon) && `${t.title} ${projects.find(p => p.id === t.projectId)?.title}`.toLowerCase().includes(term)).sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  const foundTasks = term ? workspace.tasks.filter(t => `${t.title} ${projects.find(p => p.id === t.projectId)?.title}`.toLowerCase().includes(term)) : [];
  const max = Math.max(25, ...stats.days.map(d => d.minutes));
  return <div className="dashboard"><header className="dashboard-heading"><div><p className="ws-eyebrow">Your day, at a glance</p><h1>Workspace overview</h1><p>A clear view of your projects and what’s next.</p></div><button className="ws-primary" onClick={onNewProject}><Plus size={16} /> New project</button></header>
    <div className="ws-metrics"><div><span>Tasks completed today</span><strong>{stats.tasksToday}<Check size={18} /></strong></div><div><span>Focus minutes today</span><strong>{stats.minutesToday}<Clock size={18} /></strong></div></div>
    <div className="dashboard-tools"><label className="ws-search"><Search size={17} /><input aria-label="Search projects and tasks" placeholder="Search projects and tasks…" value={search} onChange={e => setSearch(e.target.value)} />{search && <button aria-label="Clear workspace search" onClick={() => setSearch('')}><X size={14} /></button>}</label><button className="ws-secondary" disabled={!projects.length} onClick={() => onAdd() }><Plus size={15} /> Add task</button></div>
    <div className="ws-section-heading"><h2>Projects <span className="ws-count">{projects.length}</span></h2><div className="ws-filters">{[['active', 'Active'], ['paused', 'On hold'], ['completed', 'Completed']].map(([value, label]) => <button key={value} aria-pressed={status === value} onClick={() => setStatus(value)}>{label}</button>)}</div></div>
    <div className="project-card-grid">{matches.map(p => { const count = progress(workspace.tasks.filter(t => t.projectId === p.id)); return <article className="ws-card project-card" style={projectAppearance(p.icon)} key={p.id}><div className="project-card-top"><ProjectIcon icon={p.icon} title={p.title} size="md" /><span className={`project-status-pill ${p.status || 'active'}`}>{p.status === 'paused' ? 'On hold' : p.status === 'completed' ? 'Completed' : 'Active'}</span></div><button className="project-card-link" onClick={() => onOpen(p.id)}><h3>{p.title}</h3><ArrowUpRight size={16} /></button><p>{p.description || 'Add a little context to make this project easier to return to.'}</p><div className="project-card-progress"><span>{count.completed}/{count.total} tasks</span><span>{count.percent}%</span></div><div className="ws-progress"><span style={{ width: `${count.percent}%` }} /></div><footer><button onClick={() => onOpen(p.id)}>Open project <ArrowUpRight size={13} /></button><button onClick={() => onAdd(p.id)}><Plus size={14} /> Task</button></footer></article>; })}</div>
    {!matches.length && <div className="ws-card ws-empty"><h3>{projects.length ? 'No projects match this view.' : 'Your workspace starts with one project.'}</h3><p>{projects.length ? 'Try another search or status filter.' : 'Bring your context, questions, and tasks together.'}</p>{!projects.length && <button className="ws-primary" onClick={onNewProject}>Create your first project</button>}</div>}
    <div className="dashboard-bottom"><section className="ws-card"><div className="ws-section-heading"><div><p className="ws-eyebrow">Across your projects</p><h2>{term ? 'Matching tasks' : 'Upcoming & overdue tasks'}</h2><p>{term ? 'Search includes open and completed tasks.' : 'Overdue and due in the next seven days.'}</p></div><span className="ws-count">{term ? foundTasks.length : radar.length}</span></div>{(term ? foundTasks : radar).length ? <TaskRows tasks={term ? foundTasks : radar} projects={projects} workspace={workspace} onEdit={onEdit} onFocus={onFocus} showProject /> : <div className="ws-empty"><p>{term ? 'No matching tasks.' : 'Nothing due just yet. Add a due date to a task and it will appear here.'}</p></div>}</section>
    <section className="ws-card focus-summary"><p className="ws-eyebrow">Focus activity</p><h2>Focus time · last 7 days</h2><div className="focus-bars" role="img" aria-label={stats.days.map(d => `${d.label} ${d.date}: ${d.minutes} minutes`).join(', ')}>{stats.days.map(d => <div key={d.date}><span>{d.minutes ? `${d.minutes}m` : '0'}</span><div><i style={{ height: `${d.minutes / max * 100}%` }} /></div><small>{d.label}</small></div>)}</div><p>Minutes from completed focus sessions.</p></section></div>
  </div>;
}
export { default as FocusPanel } from './FocusPanel';
