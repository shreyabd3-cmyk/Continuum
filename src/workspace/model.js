export const DURATIONS = { focus: 25 * 60, short: 5 * 60, long: 15 * 60 };
export const localDate = value => {
  const d = new Date(value);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};
export const remaining = (timer, now = Date.now()) => timer?.status === 'running' ? Math.min(timer.duration, Math.max(0, Math.ceil((timer.endsAt - now) / 1000))) : timer?.remaining ?? DURATIONS[timer?.mode || 'focus'];
export const progress = tasks => ({ total: tasks.length, completed: tasks.filter(t => t.completed).length, percent: tasks.length ? Math.round(tasks.filter(t => t.completed).length / tasks.length * 100) : 0 });
export function statistics(tasks, sessions, now = Date.now()) {
  const today = localDate(now);
  const focus = sessions.filter(s => s.mode === 'focus' && s.status === 'completed');
  const todaySessions = focus.filter(s => localDate(s.completedAt) === today);
  const days = Array.from({ length: 7 }, (_, i) => { const d = new Date(now); d.setDate(d.getDate() - 6 + i); const date = localDate(d); return { date, label: d.toLocaleDateString(undefined, { weekday: 'short' }), minutes: focus.filter(s => localDate(s.completedAt) === date).reduce((n, s) => n + s.duration / 60, 0) }; });
  return { tasksToday: tasks.filter(t => t.completed && t.completedAt && localDate(t.completedAt) === today).length, minutesToday: todaySessions.reduce((n, s) => n + s.duration / 60, 0), sessionsToday: todaySessions.length, days };
}
export const newTimer = (mode = 'focus', projectId = '', taskId = '') => ({ mode, projectId, taskId, status: 'idle', remaining: DURATIONS[mode], duration: DURATIONS[mode], sessionId: '', endsAt: null });
export const canFinish = (current, observed, now) => current?.status === 'running' && current.revision === observed.revision && current.sessionId === observed.sessionId && current.endsAt <= now;
export function resumeTimer(timer, now, sessionId) {
  const seconds = timer.status === 'paused' ? remaining(timer, now) : DURATIONS[timer.mode];
  return { ...timer, status: 'running', sessionId: timer.status === 'paused' ? timer.sessionId : sessionId, endsAt: now + seconds * 1000, remaining: seconds };
}
export const pauseTimer = (timer, now) => ({ ...timer, status: 'paused', remaining: remaining(timer, now), endsAt: null });
