import { useEffect, useRef, useState } from 'react';
const readPreference = (key, fallback) => { try { const stored = localStorage.getItem(key); return stored === null ? fallback : stored === 'true'; } catch { return fallback; } };
export function useFocusAlerts() {
  const [soundEnabled, setSoundEnabled] = useState(() => readPreference('continuum:focusSound', true));
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => readPreference('continuum:focusNotifications', false));
  const [notificationState, setNotificationState] = useState(() => typeof Notification === 'undefined' ? 'unsupported' : Notification.permission);
  const [alertError, setAlertError] = useState('');
  const sound = useRef(null), preferences = useRef({ soundEnabled, notificationsEnabled });
  preferences.current = { soundEnabled, notificationsEnabled };
  useEffect(() => { try { localStorage.setItem('continuum:focusSound', String(soundEnabled)); localStorage.setItem('continuum:focusNotifications', String(notificationsEnabled)); } catch {} }, [soundEnabled, notificationsEnabled]);
  const unlockSound = () => { try { const Audio = window.AudioContext || window.webkitAudioContext; if (Audio) { sound.current ||= new Audio(); sound.current.resume().catch(() => {}); } } catch {} };
  const playChime = () => {
    try { const ctx = sound.current; if (ctx?.state !== 'running') return;
      [660, 880].forEach((frequency, i) => { const start = ctx.currentTime + i * .16, osc = ctx.createOscillator(), gain = ctx.createGain(); osc.frequency.value = frequency; gain.gain.setValueAtTime(.0001, start); gain.gain.exponentialRampToValueAtTime(.055, start + .02); gain.gain.exponentialRampToValueAtTime(.0001, start + .55); osc.connect(gain); gain.connect(ctx.destination); osc.start(start); osc.stop(start + .6); });
    } catch {}
  };
  const requestNotifications = async () => {
    setAlertError('');
    if (typeof Notification === 'undefined') { setNotificationState('unsupported'); return; }
    try { const permission = await Notification.requestPermission(); setNotificationState(permission); setNotificationsEnabled(permission === 'granted'); }
    catch { setAlertError('Notifications are unavailable in this browser. Sound and in-app alerts still work.'); }
  };
  const notifyCompletion = timer => {
    if (preferences.current.soundEnabled) playChime();
    if (!preferences.current.notificationsEnabled || typeof Notification === 'undefined' || Notification.permission !== 'granted' || !document.hidden) return;
    try {
      const notification = new Notification(timer.mode === 'focus' ? 'Focus complete 🌱' : 'Break complete', { body: timer.mode === 'focus' ? 'Your garden grew. Return to Continuum to choose a break.' : 'Ready when you are. Return to choose your next focus session.', tag: `continuum-${timer.sessionId}` });
      notification.onclick = () => { window.focus(); notification.close(); };
    } catch { setAlertError('This browser could not show a desktop notification. Sound and in-app alerts still work.'); }
  };
  return { soundEnabled, setSoundEnabled, notificationsEnabled, setNotificationsEnabled, notificationState, requestNotifications, alertError, unlockSound, previewSound: () => { unlockSound(); setTimeout(playChime, 100); }, notifyCompletion };
}
