import React, { useEffect, useRef, useState } from 'react';
import { Sprout, Moon, Sparkles, Flower2 } from 'lucide-react';
import FormDialog from '../components/FormDialog';
import { gardenProgress, GROWTH_STAGES, firstBloomDate } from './garden';

// Code-native illustration shares the app's palette and respects reduced motion.
export function Plant({ stage = 0, planted = true, small = false }) {
  return <svg className={`garden-plant ${small ? 'garden-plant--small' : ''}`} viewBox="0 0 180 150" aria-hidden="true">
    <ellipse cx="90" cy="134" rx="56" ry="7" fill="#ded2c6" opacity=".5" />
    <path d="M58 100h64l-9 31H67z" fill="#b68371" /><path d="M54 96h72v10H54z" fill="#cb9d88" />
    <ellipse cx="90" cy="97" rx="31" ry="5" fill="#6c5149" />
    {planted && stage === 0 && <ellipse cx="90" cy="92" rx="7" ry="4" transform="rotate(-22 90 92)" fill="#dec78e" />}
    {planted && stage > 0 && <g key={stage} className="garden-growth"><path d={`M90 96Q85 78 90 ${stage > 1 ? 40 : 68}`} stroke="#667652" strokeWidth="4" fill="none" strokeLinecap="round" /><path d="M88 82Q61 84 65 66Q85 64 88 82" fill="#91a17c" /><path d="M89 75Q110 76 114 57Q92 55 89 75" fill="#758c64" />{stage > 1 && <><path d="M89 58Q68 59 70 42Q87 41 89 58" fill="#a3b18c" /><path d="M90 49Q111 51 114 34Q96 34 90 49" fill="#91a17c" /></>}{stage === 3 && <ellipse cx="90" cy="30" rx="9" ry="12" fill="#ad7ca6" />}{stage >= 4 && <g fill="#a58ac5">{[0,60,120,180,240,300].map(angle => <ellipse key={angle} cx="90" cy="17" rx="8" ry="13" transform={`rotate(${angle} 90 30)`} />)}<circle cx="90" cy="30" r="8" fill="#e0bd73" /></g>}</g>}
  </svg>;
}
export default function FocusGarden({ workspace, previewStage = null }) {
  const [message, setMessage] = useState(''), [visitor, setVisitor] = useState(false), [departing, setDeparting] = useState(false), [keepsake, setKeepsake] = useState(false);
  const messageIndex = useRef(0);
  const garden = gardenProgress(workspace.sessions, !!workspace.timer?.gardenStartedAt, workspace.timer?.gardenPlantIndex);
  const preview = previewStage !== null;
  const stage = preview ? previewStage : garden.stage;
  const planted = preview || garden.planted;
  const sleepy = workspace.timer?.mode === 'long';
  const bloomDate = firstBloomDate(workspace.sessions);
  const hasKeepsake = bloomDate !== null;
  useEffect(() => {
    setVisitor(false); setDeparting(false);
    if (!planted || stage !== 4 || sleepy) return;
    let lastVisit = 0; try { lastVisit = Number(sessionStorage.getItem('continuum:butterflyVisit')) || 0; } catch {}
    if (!preview && Date.now() - lastVisit < 15 * 60 * 1000) return;
    const arrival = setTimeout(() => { if (document.hidden) return; setVisitor(true); if (!preview) { try { sessionStorage.setItem('continuum:butterflyVisit', String(Date.now())); } catch {} } }, preview ? 700 : 35000 + Math.random() * 30000);
    return () => clearTimeout(arrival);
  }, [stage, planted, sleepy, preview]);
  useEffect(() => { if (!departing) return; const timeout = setTimeout(() => { setVisitor(false); setDeparting(false); }, 1000); return () => clearTimeout(timeout); }, [departing]);
  useEffect(() => { if (!message) return; const timeout = setTimeout(() => setMessage(''), 6000); return () => clearTimeout(timeout); }, [message]);
  const greetPlant = () => {
    const messages = sleepy ? ['Rest is part of growing.', 'See you after a little breathing room.'] : ['Quietly rooting for you.', 'Small steps count.', 'A little attention goes a long way.', 'Growing at your own pace.'];
    setMessage(messages[messageIndex.current++ % messages.length]);
  };
  return <section className={`focus-garden ${sleepy ? 'garden-is-sleepy' : ''}`} aria-label="Focus garden">
    <div className="garden-title"><Sprout size={18} /><h3>Your focus garden</h3>{garden.blooms > 0 && <span>{garden.blooms} {garden.blooms === 1 ? 'bloom' : 'blooms'}</span>}</div>
    <div className="garden-scene">
      {sleepy && <span className="garden-moon" aria-hidden="true"><Moon size={22} /><i /><i /></span>}
      <button type="button" className="plant-personality" aria-label={planted ? 'Say hello to your plant' : 'Say hello to your future plant'} onClick={greetPlant}><Plant stage={stage} planted={planted} /></button>
      {visitor && <button className={`garden-butterfly ${departing ? 'butterfly-departing' : ''}`} aria-label="Let the butterfly fly away" disabled={departing} onClick={() => { setDeparting(true); setMessage('Your little visitor is off to explore.'); }}><svg viewBox="0 0 48 48" aria-hidden="true"><g className="butterfly-wings"><path d="M24 25C-2 0 2 37 22 29C2 46 22 48 24 29" fill="#b49ad2" /><path d="M24 25C50 0 46 37 26 29C46 46 26 48 24 29" fill="#c5afd9" /></g><path d="M24 18v15m0-15-4-5m4 5 4-5" stroke="#665077" strokeWidth="2" strokeLinecap="round" /></svg></button>}
    </div>
    <div className="plant-message" role="status" aria-live="polite">{message && <span key={message}>{message}</span>}</div>
    {sleepy && <p className="garden-resting"><Moon size={13} />Your garden is resting, too. Growth stays safe.</p>}
    <strong>{preview ? `${GROWTH_STAGES[stage].name} preview` : garden.planted ? GROWTH_STAGES[stage].name : 'A little focus can grow something.'}</strong>
    <p>{preview ? 'A visual preview only. No focus time is added.' : !garden.planted ? 'Start a focus session to plant your first seed.' : garden.next ? `${garden.next.minutes - garden.minutes} more focus minutes until ${garden.next.name.toLowerCase()}.` : 'Your plant has bloomed. A little time, well spent.'}</p>
    {!preview && garden.planted && <><div className="garden-progress" role="progressbar" aria-label="Plant growth" aria-valuemin={0} aria-valuemax={250} aria-valuenow={garden.minutes}><span style={{ width: `${garden.minutes / 250 * 100}%` }} /></div><small>{garden.minutes} / 250 focus minutes · across any number of days</small></>}
    {!preview && garden.stage === 4 && <button className="ws-secondary" disabled={workspace.busy} onClick={() => workspace.timerChange({ ...workspace.timer, gardenPlantIndex: garden.blooms })}>Plant another seed</button>}
    {garden.blooms > 0 && <div className="garden-collection" aria-label={`${garden.blooms} flowers in your garden`}>{Array.from({ length: Math.min(6, garden.blooms) }, (_, i) => <Plant key={i} stage={4} small />)}{garden.blooms > 6 && <span>+{garden.blooms - 6}</span>}</div>}
    {(hasKeepsake || preview && stage === 4) && <button className="garden-keepsake-link ds-text-button" onClick={() => setKeepsake(true)}><Flower2 size={16} />{hasKeepsake ? 'Your first bloom' : 'Preview first-bloom keepsake'}</button>}
    {keepsake && <FormDialog title="Your first bloom" description={hasKeepsake ? 'A little time, well spent.' : 'Keepsake preview — unlock yours with 250 completed focus minutes.'} onClose={() => setKeepsake(false)} onSubmit={event => { event.preventDefault(); setKeepsake(false); }} submitLabel="Back to garden" showCancel={false}><div className="bloom-keepsake"><Sparkles size={24} /><Plant stage={4} /><h3>Small steps. Something beautiful.</h3><p>250 minutes of focus, one session at a time.</p>{hasKeepsake ? <time dateTime={new Date(bloomDate).toISOString()}>{new Date(bloomDate).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</time> : <span className="keepsake-preview-label">Illustration preview · no reward unlocked</span>}<small>Your first flower stays here. No streak to keep, no progress to lose.</small></div></FormDialog>}
    <small>No streaks to lose. Breaks and time away never harm your plant.</small>
  </section>;
}
