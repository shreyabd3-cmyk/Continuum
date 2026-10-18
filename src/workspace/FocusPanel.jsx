import React, { useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import { Target, Play, Pause, RotateCcw, Minimize2, Sprout, Coffee, ArrowLeftRight, Bell, Volume2, X } from 'lucide-react';
import Select from '../components/Select';
import FocusGarden from './FocusGarden';
import { newTimer, remaining, resumeTimer, pauseTimer } from './model';
import './focus.css';

const read = (key, fallback) => { try { return localStorage.getItem(key) || fallback; } catch { return fallback; } };
const MODES = [['focus', 'Focus · 25 min'], ['short', 'Short break · 5 min'], ['long', 'Long break · 15 min']];
export default function FocusPanel({ projects, workspace, isDemo = false, openRequest = 0 }) {
  const { timer, timerChange, now, busy, unlockSound, alerts } = workspace;
  const [floating, setFloating] = useState(() => read('continuum:focusView', 'panel') === 'floating');
  const changeView = value => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (document.startViewTransition && !reducedMotion && !document.hidden) {
      document.startViewTransition(() => flushSync(() => setFloating(value)));
    } else setFloating(value);
  };
  const [corner, setCorner] = useState(() => read('continuum:focusCorner', 'right'));
  const [finishedForNow, setFinishedForNow] = useState('');
  const [previewStage, setPreviewStage] = useState(null);
  const seconds = timer ? remaining(timer, now) : 0;
  useEffect(() => { if (!openRequest) return; setFloating(false); const frame = requestAnimationFrame(() => document.querySelector('.focus-panel')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' })); return () => cancelAnimationFrame(frame); }, [openRequest]);
  useEffect(() => { try { localStorage.setItem('continuum:focusView', floating ? 'floating' : 'panel'); localStorage.setItem('continuum:focusCorner', corner); } catch {} }, [floating, corner]);
  useEffect(() => {
    const title = document.title;
    if (timer?.status === 'completed') document.title = `${timer.mode === 'focus' ? '✓ Focus complete' : '✓ Break complete'} — Continuum`;
    else if (timer?.status === 'running') document.title = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')} — Continuum`;
    return () => { document.title = title; };
  }, [timer?.status, timer?.mode, seconds]);
  if (!timer) return <aside className="focus-panel"><p>Loading your focus session…</p></aside>;
  const isFocus = timer.mode === 'focus', active = ['running', 'paused'].includes(timer.status), completed = timer.status === 'completed';
  const project = projects.find(p => p.id === timer.projectId), task = workspace.tasks.find(t => t.id === timer.taskId);
  const time = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
  const label = `${Math.floor(seconds / 60)} minutes ${seconds % 60} seconds remaining`;
  const change = (mode = timer.mode, projectId = timer.projectId, taskId = timer.taskId) => {
    if (active && !window.confirm('End this session and change focus? Unfinished sessions do not count toward focus time.')) return;
    setFinishedForNow(''); timerChange(newTimer(mode, projectId, taskId));
  };
  const start = () => {
    if (isFocus && !project) { setFloating(false); return; }
    unlockSound(); setFinishedForNow('');
    timerChange({ ...resumeTimer(timer, Date.now(), crypto.randomUUID()), gardenStartedAt: timer.gardenStartedAt || (isFocus ? Date.now() : null) });
  };
  const toggle = () => timer.status === 'running' ? timerChange(pauseTimer(timer, Date.now())) : start();
  const fraction = Math.max(0, Math.min(1, (timer.duration - seconds) / timer.duration));
  const ModeIcon = isFocus ? Sprout : Coffee;
  const completion = <div className="focus-completion" role="status"><strong>{isFocus ? 'A little focus. A little growth.' : 'Break complete. Welcome back.'}</strong><p>{isFocus ? `${Math.round(timer.duration / 60)} focus minutes saved. Your task stays open until you check it off.` : 'Choose when to start your next focus session.'}</p><div className="completion-actions">{isFocus && <button className="ws-primary" disabled={busy} onClick={() => change('short')}>Take a short break</button>}{isFocus && <button className="ws-secondary" disabled={busy} onClick={() => change('long')}>Take a long break</button>}<button className={isFocus ? 'ds-text-button' : 'ws-primary'} disabled={busy} onClick={() => isFocus ? start() : change('focus')}>{isFocus ? 'Focus again' : 'Back to focus'}</button><button className="ds-text-button" onClick={() => { setFinishedForNow(timer.sessionId); changeView(true); }}>Finish for now</button></div></div>;
  if (floating) return <aside className={`focus-panel floating-focus floating-focus--${corner} ${completed ? 'is-finished' : ''} ${isFocus ? '' : 'is-break'}`} aria-label="Floating focus timer">
    {completed && finishedForNow !== timer.sessionId && <div className="floating-completion"><button className="ds-icon-button floating-dismiss" aria-label="Dismiss completion message" onClick={() => setFinishedForNow(timer.sessionId)}><X size={16} /></button>{completion}</div>}
    <div className="focus-pill"><span className="pill-progress" style={{ '--timer-progress': `${fraction * 360}deg` }}><ModeIcon size={19} /></span><button className="pill-time" aria-label={`Open ${isFocus ? 'focus' : 'break'} timer, ${label}`} onClick={() => changeView(false)}><small>{completed ? 'Complete' : isFocus ? timer.status === 'paused' ? 'Focus paused' : 'Focus' : 'Break'}</small><strong role="timer" aria-label={label}>{time}</strong></button><button className="ds-icon-button" aria-label={completed ? 'Choose next session' : timer.status === 'running' ? 'Pause timer' : timer.status === 'paused' ? 'Resume timer' : 'Start timer'} disabled={busy} onClick={() => completed ? changeView(false) : toggle()}>{timer.status === 'running' ? <Pause size={19} /> : <Play size={19} />}</button><button className="ds-icon-button pill-move" aria-label={`Move timer to ${corner === 'right' ? 'left' : 'right'} corner`} onClick={() => setCorner(corner === 'right' ? 'left' : 'right')}><ArrowLeftRight size={16} /></button></div>
  </aside>;
  return <aside className={`focus-panel focus-panel--garden ${isFocus ? '' : 'is-break'}`} aria-label="Focus timer panel">
    <div className="focus-panel-heading"><span><Target size={19} /> Focus timer</span><button className="ds-icon-button focus-size-toggle" aria-label="Collapse to floating timer" title="Collapse to floating timer" onClick={() => changeView(true)}><Minimize2 size={19} /></button></div>
    <Select aria-label="Session mode" value={timer.mode} disabled={busy} onChange={e => change(e.target.value)}>{MODES.map(([mode, text]) => <option value={mode} key={mode}>{text}</option>)}</Select>
    <div className="timer-circle"><svg viewBox="0 0 200 200" aria-hidden="true"><circle cx="100" cy="100" r="88" /><circle className="timer-ring" cx="100" cy="100" r="88" strokeDasharray={553} strokeDashoffset={553 * (1 - fraction)} /></svg><div><strong role="timer" aria-label={label}>{time}</strong><span>{timer.status === 'paused' ? 'Paused. Take your time.' : completed ? 'Complete' : isFocus ? 'One thing at a time' : 'A little breathing room'}</span></div></div>
    {!completed && <div className="timer-controls"><button className="ws-primary" disabled={busy || (isFocus && !project)} onClick={toggle}>{timer.status === 'running' ? <Pause size={16} /> : <Play size={16} />}{timer.status === 'running' ? 'Pause' : timer.status === 'paused' ? 'Resume' : isFocus ? timer.gardenStartedAt || workspace.sessions.length ? 'Start focus' : 'Plant seed & start' : 'Start break'}</button><button className="ws-secondary" aria-label="Reset timer" title="Reset timer" disabled={busy} onClick={() => change()}><RotateCcw size={17} /></button></div>}
    {completed && completion}
    {isFocus ? <div className="focus-selection"><label>Project<Select aria-label="Focus project" value={project ? timer.projectId : ''} disabled={busy} onChange={e => change(timer.mode, e.target.value, '')}><option value="">Choose a project</option>{projects.map(p => <option value={p.id} key={p.id}>{p.title}</option>)}</Select></label><label>Task <span>optional</span><Select aria-label="Focus task" value={task?.id || ''} disabled={busy || !project} onChange={e => change(timer.mode, timer.projectId, e.target.value)}><option value="">Project focus · no task</option>{workspace.tasks.filter(t => t.projectId === timer.projectId && (!t.completed || t.id === timer.taskId)).map(t => <option key={t.id} value={t.id}>{t.title}</option>)}</Select></label>{timer.taskId && !task && <p className="focus-helper">The original task is no longer available. This session keeps its association.</p>}</div> : <div className="break-invitation"><Coffee size={22} /><strong>Step away for a moment.</strong><p>Stretch, get some water, or rest your eyes.</p><small>{project ? 'Your project and task will be ready when you return.' : 'No project needed. This time is for you.'}</small></div>}
    <FocusGarden workspace={workspace} previewStage={previewStage} />
    <details className="focus-alert-settings"><summary><Bell size={16} /> Completion alerts</summary><label className="focus-setting"><input type="checkbox" checked={alerts.soundEnabled} onChange={e => { alerts.setSoundEnabled(e.target.checked); if (e.target.checked) unlockSound(); }} /> Soft chime</label><button className="ds-text-button" onClick={alerts.previewSound}><Volume2 size={16} /> Preview sound</button>{alerts.notificationState === 'granted' ? <label className="focus-setting"><input type="checkbox" checked={alerts.notificationsEnabled} onChange={e => alerts.setNotificationsEnabled(e.target.checked)} /> Desktop notifications</label> : <button className="ws-secondary" disabled={alerts.notificationState === 'unsupported' || alerts.notificationState === 'denied'} onClick={alerts.requestNotifications}>Enable notifications</button>}<p>{alerts.notificationState === 'denied' ? 'Notifications are blocked. Allow them in your browser’s site settings to enable them here.' : alerts.notificationState === 'unsupported' ? 'Desktop notifications are not supported in this browser.' : 'When you’re away from this tab, click a notification to return. Browser and device settings may delay alerts.'}</p>{alerts.alertError && <p role="status">{alerts.alertError}</p>}</details>
    {isDemo && <details className="garden-preview"><summary>Preview plant growth</summary><p>Try the illustrations. This does not add activity.</p><div>{['Seed', 'Sprout', 'Leaves', 'Budding', 'Bloom'].map((name, i) => <button className="ds-chip" aria-pressed={previewStage === i} key={name} onClick={() => setPreviewStage(i)}>{name}</button>)}{previewStage !== null && <button className="ds-text-button" onClick={() => setPreviewStage(null)}>Back to actual progress</button>}</div></details>}
  </aside>;
}
