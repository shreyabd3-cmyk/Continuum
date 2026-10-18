export const GROWTH_STAGES = [
  { minutes: 0, name: 'Seed' }, { minutes: 25, name: 'Sprout' },
  { minutes: 75, name: 'Leaves' }, { minutes: 150, name: 'Budding' },
  { minutes: 250, name: 'Bloom' },
];
export function gardenProgress(sessions, planted = false, plantIndex = 0) {
  const seen = new Set();
  const total = sessions.reduce((sum, session) => {
    if (seen.has(session.id) || session.mode !== 'focus' || session.status !== 'completed' || !(session.duration > 0)) return sum;
    seen.add(session.id); return sum + session.duration / 60;
  }, 0);
  const blooms = Math.floor(total / 250);
  const index = Math.min(blooms, Math.max(plantIndex || 0, Math.max(0, Math.ceil(total / 250) - 1)));
  const minutes = Math.min(250, Math.max(0, total - index * 250));
  const stage = GROWTH_STAGES.reduce((current, candidate, i) => minutes >= candidate.minutes ? i : current, 0);
  return { total, blooms, index, minutes, stage, planted: planted || total > 0, next: GROWTH_STAGES[stage + 1] || null };
}
