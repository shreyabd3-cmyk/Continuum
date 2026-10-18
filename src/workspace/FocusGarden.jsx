import React from 'react';
import { Sprout } from 'lucide-react';
import { gardenProgress, GROWTH_STAGES } from './garden';

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
  const garden = gardenProgress(workspace.sessions, !!workspace.timer?.gardenStartedAt, workspace.timer?.gardenPlantIndex);
  const preview = previewStage !== null;
  const stage = preview ? previewStage : garden.stage;
  return <section className="focus-garden" aria-label="Focus garden">
    <div className="garden-title"><Sprout size={18} /><h3>Your focus garden</h3>{garden.blooms > 0 && <span>{garden.blooms} {garden.blooms === 1 ? 'bloom' : 'blooms'}</span>}</div>
    <Plant stage={stage} planted={preview || garden.planted} />
    <strong>{preview ? `${GROWTH_STAGES[stage].name} preview` : garden.planted ? GROWTH_STAGES[stage].name : 'A little focus can grow something.'}</strong>
    <p>{preview ? 'A visual preview only. No focus time is added.' : !garden.planted ? 'Start a focus session to plant your first seed.' : garden.next ? `${garden.next.minutes - garden.minutes} more focus minutes until ${garden.next.name.toLowerCase()}.` : 'Your plant has bloomed. A little time, well spent.'}</p>
    {!preview && garden.planted && <><div className="garden-progress" role="progressbar" aria-label="Plant growth" aria-valuemin={0} aria-valuemax={250} aria-valuenow={garden.minutes}><span style={{ width: `${garden.minutes / 250 * 100}%` }} /></div><small>{garden.minutes} / 250 focus minutes · across any number of days</small></>}
    {!preview && garden.stage === 4 && <button className="ws-secondary" disabled={workspace.busy} onClick={() => workspace.timerChange({ ...workspace.timer, gardenPlantIndex: garden.blooms })}>Plant another seed</button>}
    {garden.blooms > 0 && <div className="garden-collection" aria-label={`${garden.blooms} flowers in your garden`}>{Array.from({ length: Math.min(6, garden.blooms) }, (_, i) => <Plant key={i} stage={4} small />)}{garden.blooms > 6 && <span>+{garden.blooms - 6}</span>}</div>}
    <small>No streaks to lose. Breaks and time away never harm your plant.</small>
  </section>;
}
