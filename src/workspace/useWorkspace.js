import { useEffect, useRef, useState } from 'react';
import { collection, doc, onSnapshot, runTransaction, setDoc, deleteDoc } from 'firebase/firestore';
import { newTimer, remaining, canFinish } from './model';

export function useWorkspace(db, uid, demo) {
  const [tasks, setTasks] = useState([]), [sessions, setSessions] = useState([]), [timer, setTimer] = useState(null);
  const [loading, setLoading] = useState(true), [error, setError] = useState(''), [busy, setBusy] = useState(false), [now, setNow] = useState(Date.now());
  const mutation = useRef(false), completionRetryAt = useRef(0);
  const finishing = useRef(false), sound = useRef(null), identity = useRef('');
  const root = ['artifacts', 'continuum-v1', 'users', uid || 'preview'];
  useEffect(() => {
    identity.current = uid || (demo ? 'demo' : '');
    setTasks([]); setSessions([]); setTimer(null); setError(''); setLoading(true);
    if (demo) { setTimer(newTimer()); setLoading(false); return; }
    if (!uid) return;
    let ready = new Set();
    const fail = () => { setError('Could not load workspace data. Check your connection and Firestore permissions.'); setLoading(false); };
    const loaded = key => { ready.add(key); if (ready.size === 3) setLoading(false); };
    const unsub = [
      onSnapshot(collection(db, ...root, 'tasks'), snapshot => { setTasks(snapshot.docs.map(d => ({ ...d.data(), id: d.id }))); loaded('tasks'); }, fail),
      onSnapshot(collection(db, ...root, 'focusSessions'), snapshot => { setSessions(snapshot.docs.map(d => ({ ...d.data(), id: d.id }))); loaded('sessions'); }, fail),
      onSnapshot(doc(db, ...root, 'workspace', 'timer'), snapshot => { setTimer(snapshot.exists() ? snapshot.data() : newTimer()); loaded('timer'); }, fail),
    ];
    return () => { identity.current = ''; unsub.forEach(fn => fn()); };
  }, [uid, demo, db]);
  useEffect(() => { const id = setInterval(() => setNow(Date.now()), 500); return () => clearInterval(id); }, []);
  const perform = async action => {
    if (mutation.current) return false;
    mutation.current = true; setError(''); setBusy(true);
    try { return await action(); } catch (e) { setError(e.message === 'Timer changed in another tab. Please try again.' ? e.message : 'Could not save. Check your connection and try again.'); return false; } finally { mutation.current = false; setBusy(false); }
  };
  const saveTask = data => perform(async () => {
    if (!demo && !uid) return false;
    const owner = identity.current;
    const id = data.id || crypto.randomUUID();
    const task = { title: data.title.trim(), projectId: data.projectId, dueDate: data.dueDate || '', completed: !!data.completed, completedAt: data.completed ? data.completedAt || Date.now() : null, createdAt: data.createdAt || Date.now(), updatedAt: Date.now(), id };
    if (!task.title || !task.projectId) throw new Error('Missing task title or project');
    if (!demo) await setDoc(doc(db, ...root, 'tasks', id), task);
    if (owner === identity.current) setTasks(prev => [...prev.filter(t => t.id !== id), task]); return true;
  });
  const removeTask = task => perform(async () => { const owner = identity.current; if (!demo) await deleteDoc(doc(db, ...root, 'tasks', task.id)); if (owner === identity.current) setTasks(prev => prev.filter(t => t.id !== task.id)); return true; });
  const timerChange = (next, expected = timer) => perform(async () => {
    const owner = identity.current;
    const value = { ...next, revision: crypto.randomUUID() };
    if (!demo) await runTransaction(db, async tx => {
      const ref = doc(db, ...root, 'workspace', 'timer'), snap = await tx.get(ref);
      if ((snap.data()?.revision || '') !== (expected?.revision || '')) throw new Error('Timer changed in another tab. Please try again.');
      tx.set(ref, value);
    });
    if (owner === identity.current) setTimer(value); return true;
  });
  const unlockSound = () => { try { const Audio = window.AudioContext || window.webkitAudioContext; if (Audio) { sound.current ||= new Audio(); sound.current.resume(); } } catch {} };
  useEffect(() => {
    if (!timer || timer.status !== 'running' || remaining(timer, now) > 0 || now < completionRetryAt.current || finishing.current || (!uid && !demo)) return;
    finishing.current = true;
    const owner = identity.current;
    const finish = async () => {
      let recorded = false;
      const finished = { ...timer, status: 'completed', remaining: 0, revision: crypto.randomUUID() };
      const record = { id: timer.sessionId, projectId: timer.projectId, taskId: timer.taskId || '', mode: timer.mode, status: 'completed', duration: timer.duration, completedAt: timer.endsAt };
      try {
        if (demo) { if (timer.mode === 'focus') setSessions(prev => prev.some(s => s.id === record.id) ? prev : [...prev, record]); recorded = true; }
        else await runTransaction(db, async tx => {
          recorded = false;
          const ref = doc(db, ...root, 'workspace', 'timer');
          const snapshot = await tx.get(ref); const current = snapshot.data();
          if (!canFinish(current, timer, Date.now())) return;
          const sessionRef = doc(db, ...root, 'focusSessions', timer.sessionId);
          const session = await tx.get(sessionRef);
          if (timer.mode === 'focus' && !session.exists()) tx.set(sessionRef, record);
          tx.set(ref, finished); recorded = true;
        });
        if (recorded && owner === identity.current) { completionRetryAt.current = 0; setError(''); setTimer(finished); try { const ctx = sound.current; if (ctx?.state === 'running') { const osc = ctx.createOscillator(), gain = ctx.createGain(); osc.frequency.value = 660; gain.gain.setValueAtTime(.07, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + .5); osc.connect(gain); gain.connect(ctx.destination); osc.start(); osc.stop(ctx.currentTime + .5); } } catch {} }
      } catch { completionRetryAt.current = Date.now() + 5000; if (owner === identity.current) setError('Session could not be saved. Keep this workspace open; it will retry when connected.'); }
      finally { finishing.current = false; }
    };
    finish();
  }, [timer, now, uid, demo, db]);
  return { tasks, sessions, timer, loading, error, busy, now, saveTask, removeTask, timerChange, unlockSound };
}
