import test from 'node:test';
import assert from 'node:assert/strict';
import { DURATIONS, localDate, newTimer, remaining, progress, statistics, canFinish, resumeTimer, pauseTimer } from '../src/workspace/model.js';

test('progress uses actual tasks and returns to zero when unchecked', () => {
  assert.deepEqual(progress([]), { total: 0, completed: 0, percent: 0 });
  const tasks = [{ completed: false }, { completed: true }, { completed: true }];
  assert.equal(progress(tasks).percent, 67);
  tasks[1].completed = false; tasks[2].completed = false;
  assert.equal(progress(tasks).percent, 0);
});
test('focus and break durations are 25, 5 and 15 minutes', () => {
  assert.deepEqual(DURATIONS, { focus: 1500, short: 300, long: 900 });
});
test('elapsed wall time catches up after background throttling and refresh serialization', () => {
  const start = Date.now(), timer = resumeTimer(newTimer('focus', 'p', 't'), start, 'session');
  assert.equal(remaining(timer, start + 95000), 1405);
  const recovered = JSON.parse(JSON.stringify(timer));
  assert.equal(remaining(recovered, start + 1499999), 1);
  assert.equal(remaining(recovered, start + 1900000), 0);
  assert.equal(recovered.taskId, 't');
});
test('pause freezes countdown, resume retains the session identity and remaining time', () => {
  const running = resumeTimer(newTimer('focus', 'p'), 1000, 'one');
  const paused = pauseTimer(running, 61000);
  assert.equal(remaining(paused, 1000000), 1440);
  const resumed = resumeTimer(paused, 1000000, 'unused');
  assert.equal(resumed.sessionId, 'one');
  assert.equal(resumed.endsAt, 2440000);
});
test('reset abandons the prior session and does not create a focus record', () => {
  const reset = newTimer('focus', 'p', 't');
  assert.equal(reset.status, 'idle'); assert.equal(reset.sessionId, '');
  assert.equal(canFinish(reset, reset, Date.now()), false);
});
test('completion guard rejects early, duplicate, stale and superseded timers', () => {
  const timer = { ...resumeTimer(newTimer('focus', 'p'), 0, 'one'), revision: 'r1' };
  assert.equal(canFinish(timer, timer, 1499999), false);
  assert.equal(canFinish(timer, timer, 1500000), true);
  assert.equal(canFinish({ ...timer, status: 'completed' }, timer, 1600000), false);
  assert.equal(canFinish({ ...timer, revision: 'r2' }, timer, 1600000), false);
  assert.equal(canFinish({ ...timer, sessionId: 'other' }, timer, 1600000), false);
});
test('daily totals use local calendar boundaries and exclude breaks and abandoned sessions', () => {
  const now = new Date(2026, 9, 17, 13).getTime();
  const today = new Date(2026, 9, 17, 0, 1).getTime(), yesterday = new Date(2026, 9, 16, 23, 59).getTime();
  const tasks = [{ completed: true, completedAt: today }, { completed: false, completedAt: today }, { completed: true, completedAt: yesterday }];
  const sessions = [{ mode: 'focus', status: 'completed', completedAt: today, duration: 1500 }, { mode: 'short', status: 'completed', completedAt: today, duration: 300 }, { mode: 'focus', status: 'abandoned', completedAt: today, duration: 1500 }, { mode: 'focus', status: 'completed', completedAt: yesterday, duration: 1500 }];
  const stats = statistics(tasks, sessions, now);
  assert.equal(stats.tasksToday, 1); assert.equal(stats.minutesToday, 25); assert.equal(stats.sessionsToday, 1);
  assert.equal(stats.days.length, 7); assert.equal(stats.days[6].minutes, 25); assert.equal(stats.days[5].minutes, 25);
  assert.equal(localDate(now), '2026-10-17');
});
test('zero activity renders zero metrics and zero seven-day bars', () => {
  const stats = statistics([], []); assert.equal(stats.minutesToday, 0); assert.equal(stats.tasksToday, 0); assert.equal(stats.sessionsToday, 0); assert.ok(stats.days.every(d => d.minutes === 0));
});
test('seven-day calendar summary spans daylight saving changes without shifting dates', () => {
  const stats = statistics([], [], new Date(2026, 10, 3, 12).getTime());
  assert.deepEqual(stats.days.map(d => d.date), ['2026-10-28','2026-10-29','2026-10-30','2026-10-31','2026-11-01','2026-11-02','2026-11-03']);
});

test('a stale render clock never displays more than the configured session length', () => {
  const timer = resumeTimer(newTimer('focus', 'p'), 1000, 'one');
  assert.equal(remaining(timer, 500), 1500);
});
