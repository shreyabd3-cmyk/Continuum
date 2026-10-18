import React, { useState, useEffect, useRef } from "react";
import {
  Folder, PauseCircle, PlayCircle, Plus,
  Link as LinkIcon, Image as ImageIcon, ExternalLink, Trash2,
  X, CheckCircle2, Circle, ChevronDown, ChevronUp, Edit2,
  File as FileIcon, Calendar, Settings, PanelLeft, PanelRight,
  LogOut, Loader2, AlertCircle,
  CheckSquare, RotateCcw, List, MessageCircle, Mail, ArrowLeft,
  Send, Menu, Smile, Upload, Clock, AlertTriangle, Search, ArrowUpRight, Layers, LayoutDashboard, Target,
} from "lucide-react";

import { Dashboard, NextSteps, FocusPanel, TaskEditor } from "./workspace/Workspace";
import FormDialog, { Field, useDialogForm } from "./components/FormDialog";
import { resourceURL } from "./workspace/resources";
import ResourceLibrary from "./workspace/ResourceLibrary";
import ProjectIcon from "./components/ProjectIcon";
import AnimatedCheckbox from "./components/AnimatedCheckbox";
import useListMotion from "./hooks/useListMotion";
import { ICON_COLORS, parseIcon } from "./workspace/projectAppearance";
import Select from "./components/Select";
import { useWorkspace } from "./workspace/useWorkspace";
import { newTimer } from "./workspace/model";

import { initializeApp } from "firebase/app";
import {
  getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged,
  signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword,
  sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink,
  fetchSignInMethodsForEmail, sendPasswordResetEmail,
} from "firebase/auth";
import {
  getFirestore, collection, addDoc, updateDoc, deleteDoc,
  doc, onSnapshot, query, runTransaction,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD1cwBv2_XxyFKdbp4iqZadOnljT2oZ3NM",
  authDomain: "continuum-6e7dc.firebaseapp.com",
  projectId: "continuum-6e7dc",
  storageBucket: "continuum-6e7dc.firebasestorage.app",
  messagingSenderId: "867995488048",
  appId: "1:867995488048:web:50a557cca5982c3b7d42f5",
  measurementId: "G-LJXK4WV2QH",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = "continuum-v1";

const ContinuumLogo = ({ className = "", style = {} }) => (
  <svg viewBox="0 0 912 428" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
    <g clipPath="url(#clogo)">
      <path d="M0.779776 220.18C-4.71022 121.98 71.0198 23.1098 166.16 4.2798C202.69 -2.9502 240.42 -1.9602 275.26 7.1398C305.41 15.0098 333.2 28.9698 353.5 46.4298C369.2 59.9398 398.18 89.9098 420.15 113.13C435.87 129.74 434.91 155.95 418.04 171.4L418.01 171.43C401.44 186.61 375.7 185.7 360.26 169.38C338.5 146.4 312.15 119.19 299.73 108.5C283.21 94.2898 239.86 73.2898 182.19 84.6998C156.11 89.8598 130.14 107.32 110.93 132.61C91.6098 158.04 81.4098 188.29 82.9398 215.61C83.8698 232.14 88.2598 264.1 107.27 292.39C126.61 321.15 155.53 338.01 195.69 343.93C269.06 354.74 314.71 310.49 318.2 306.98L318.51 306.63L318.43 306.74C325.38 299.51 489.24 129.09 548.29 72.9198C575.79 46.7598 606.34 28.1098 639.1 17.4898C649.16 14.2298 657.27 11.4998 667.75 9.7498C693.91 5.3798 716.76 10.56 722.5 37.5C726.92 67.97 704.48 84.34 685.5 87.5C656 95 629.28 109.24 605.11 132.23C547.38 187.14 379.55 361.7 377.86 363.46C372.32 369.23 313.79 427.64 218.66 427.64C207.48 427.64 195.81 426.83 183.65 425.04C56.2298 406.27 5.62978 306.91 0.779776 220.18Z" fill="currentColor"/>
      <path d="M569.24 260.891C554.716 243.519 528.859 241.21 511.487 255.734C494.115 270.258 491.806 296.115 506.33 313.487L514.014 322.678C528.538 340.05 554.395 342.359 571.767 327.835C589.139 313.311 591.448 287.454 576.924 270.082L569.24 260.891Z" fill="currentColor"/>
      <path d="M611.54 399.08C631.168 399.08 647.08 383.168 647.08 363.54C647.08 343.912 631.168 328 611.54 328C591.912 328 576 343.912 576 363.54C576 383.168 591.912 399.08 611.54 399.08Z" fill="currentColor"/>
      <path d="M698.54 424.08C718.168 424.08 734.08 408.168 734.08 388.54C734.08 368.912 718.168 353 698.54 353C678.912 353 663 368.912 663 388.54C663 408.168 678.912 424.08 698.54 424.08Z" fill="currentColor"/>
      <path d="M788.54 407.08C808.168 407.08 824.08 391.168 824.08 371.54C824.08 351.912 808.168 336 788.54 336C768.912 336 753 351.912 753 371.54C753 391.168 768.912 407.08 788.54 407.08Z" fill="currentColor"/>
      <path d="M853.54 344.08C873.168 344.08 889.08 328.168 889.08 308.54C889.08 288.912 873.168 273 853.54 273C833.912 273 818 288.912 818 308.54C818 328.168 833.912 344.08 853.54 344.08Z" fill="currentColor"/>
      <path d="M876.54 255.08C896.168 255.08 912.08 239.168 912.08 219.54C912.08 199.912 896.168 184 876.54 184C856.912 184 841 199.912 841 219.54C841 239.168 856.912 255.08 876.54 255.08Z" fill="currentColor"/>
      <path d="M846.55 170.08C866.178 170.08 882.09 154.168 882.09 134.54C882.09 114.912 866.178 99 846.55 99C826.922 99 811.01 114.912 811.01 134.54C811.01 154.168 826.922 170.08 846.55 170.08Z" fill="currentColor"/>
      <path d="M775.54 111.08C795.168 111.08 811.08 95.1682 811.08 75.54C811.08 55.9118 795.168 40 775.54 40C755.912 40 740 55.9118 740 75.54C740 95.1682 755.912 111.08 775.54 111.08Z" fill="currentColor"/>
    </g>
    <defs>
      <clipPath id="clogo">
        <rect width="912" height="428" fill="white"/>
      </clipPath>
    </defs>
  </svg>
);

const DEFAULT_TAGS = [
  "UI Inspiration", "Interaction", "Article", "Project Doc",
  "UX", "Frontend", "Backend", "Design System",
];
const generateId = () => Math.random().toString(36).substr(2, 9);
const SLIDE_DURATION = 4600;

const fetchOGPreview = async (url) => {
  try {
    const res = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
    if (!res.ok) return null;
    const data = await res.json();
    const html = data.contents || "";
    const doc = new DOMParser().parseFromString(html, "text/html");
    const getMeta = (prop) =>
      doc.querySelector(`meta[property="${prop}"]`)?.getAttribute("content") ||
      doc.querySelector(`meta[name="${prop}"]`)?.getAttribute("content") || "";
    const image = getMeta("og:image") || getMeta("twitter:image");
    const title = getMeta("og:title") || getMeta("twitter:title") || doc.querySelector("title")?.textContent || "";
    const description = getMeta("og:description") || getMeta("twitter:description") || getMeta("description") || "";
    const hostname = new URL(url).hostname;
    const favicon = `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`;
    return { image, title, description, favicon, hostname };
  } catch {
    return null;
  }
};

const DEMO_PROJECTS = [
  {
    id: "demo-1", title: "Harlow & Co. Redesign", client: "Harlow & Co.",
    startDate: "2026-03-01", icon: "🎨",
    description: "Full website redesign focusing on improved IA and content strategy.",
    status: "active", lastUpdated: new Date().toISOString(),
    whereIAm: "Sitemap v2 delivered and approved last week. Now moving into content audit phase.",
    dontForget: "", dontForgetMode: "checklist",
    dontForgetItems: [
      { id: "d1", text: "Max 6 top-level nav items — client was firm on this", checked: false },
      { id: "d2", text: "Blog is being retired, don't include it in sitemap", checked: false },
      { id: "d3", text: "Legal pages go under utility nav, not main nav", checked: true },
    ],
    notes: [
      { id: "n1", type: "question", content: "Has the client signed off on the proposed taxonomy for the product section?", timestamp: "3/18/2026", isResolved: false },
      { id: "n2", type: "question", content: "Are we handling the CMS migration or just providing the IA deliverables?", timestamp: "3/19/2026", isResolved: false },
      { id: "n3", type: "question", content: "Who is the main stakeholder for content decisions?", timestamp: "3/10/2026", isResolved: true },
    ],
    resources: [
      { id: "r1", type: "link", title: "Sitemap v2 — Figma", url: "https://figma.com", description: "Approved sitemap, version 2.", tags: ["Project Doc"] },
      { id: "r2", type: "document", title: "Content Audit Template", url: "https://docs.google.com", description: "Working spreadsheet for the full content inventory.", tags: ["Project Doc", "UX"] },
    ],
  },
  {
    id: "demo-2", title: "Meridian Health Platform", client: "Meridian Health",
    startDate: "2026-02-10", icon: "🏥|#586F96",
    description: "Patient-facing portal redesign. Heavy focus on information architecture.",
    status: "active", lastUpdated: new Date().toISOString(),
    whereIAm: "Discovery phase complete. Just finished stakeholder interviews and card sorting sessions with 12 patients.",
    dontForget: "Accessibility is non-negotiable — WCAG AA minimum. Legal team must review any content changes.",
    dontForgetMode: "text", dontForgetItems: [],
    notes: [{ id: "n4", type: "question", content: "Do we have access to the current site analytics to understand drop-off points?", timestamp: "3/15/2026", isResolved: false }],
    resources: [{ id: "r4", type: "document", title: "Card Sort Results", url: "https://docs.google.com", description: "Raw results from Optimal Workshop sessions.", tags: ["UX", "Project Doc"] }],
  },
  {
    id: "demo-3", title: "Volta E-commerce IA", client: "Volta",
    startDate: "2026-01-15", icon: "⚡|#84623C",
    description: "IA overhaul for a fast-growing electric vehicle accessories brand.",
    status: "paused", lastUpdated: new Date().toISOString(),
    whereIAm: "Paused — client is going through internal restructure. Resume expected late April.",
    dontForget: "", dontForgetMode: "text", dontForgetItems: [], notes: [],
    resources: [{ id: "r5", type: "link", title: "Sitemap v1 Draft", url: "https://figma.com", description: "First draft — not yet reviewed by client.", tags: ["Project Doc"] }],
  },
];

const Button = ({ variant = "primary", className = "", children, ...props }) => {
  const styles = {
    primary: "bg-indigo-600 text-slate-50 hover:bg-indigo-700 shadow-sm hover:shadow-md border border-transparent",
    secondary: "bg-slate-50 text-slate-700 border border-slate-300 hover:bg-slate-100 shadow-sm",
    tertiary: "text-slate-600 hover:bg-slate-100 hover:text-slate-900 bg-transparent border border-transparent",
    soft: "bg-indigo-50 text-indigo-900 hover:bg-indigo-100 border border-transparent",
    amber: "bg-amber-50 text-amber-900 hover:bg-amber-100 border border-transparent",
    destructive: "text-red-600 hover:bg-red-50 hover:text-red-700 bg-transparent border border-transparent",
    icon: "p-2.5 text-slate-400 hover:text-indigo-900 hover:bg-indigo-50 rounded-full border border-transparent",
    google: "bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100 hover:border-slate-300 shadow-sm",
  };
  const base = variant === "icon"
    ? styles.icon
    : "inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ease-apple active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100";
  return (
    <button className={`ds-button ds-button--${variant} ${base} ${variant !== "icon" ? styles[variant] : ""} ${className}`} {...props}>
      {children}
    </button>
  );
};

const Input = ({ className = "", ...props }) => (
  <input className={`ds-input w-full bg-slate-100 hover:bg-slate-200/60 focus:bg-slate-50 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 border border-slate-200 transition-all duration-200 ease-apple placeholder:text-slate-400 ${className}`} {...props} />
);

const TextArea = ({ className = "", ...props }) => (
  <textarea className={`ds-textarea w-full bg-slate-100 hover:bg-slate-200/60 focus:bg-slate-50 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 border border-slate-200 transition-all duration-200 ease-apple placeholder:text-slate-400 resize-none ${className}`} {...props} />
);

const Badge = ({ children, color = "slate", className = "" }) => {
  const colors = {
    slate: "bg-slate-100 text-slate-700 border-slate-200",
    green: "bg-emerald-50 text-emerald-700 border-emerald-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    indigo: "bg-indigo-50 text-indigo-700 border-indigo-200",
  };
  return <span className={`ds-badge ds-badge--${color} px-3 py-1 rounded-lg text-xs font-medium border ${colors[color]} ${className}`}>{children}</span>;
};

const IconPicker = ({ value, onChange }) => {
  const [mode, setMode] = useState("text");
  const { text: initText, color: initColor } = parseIcon(value);
  const [textInput, setTextInput] = useState(initText);
  const [selectedColor, setSelectedColor] = useState(initColor || ICON_COLORS[0].hex);
  const fileRef = useRef(null);

  const emitValue = (t, c) => {
    const txt = t.trim();
    if (txt) onChange(`${txt}|${c}`);
    else onChange("");
  };

  const handleTextInput = (val) => {
    const cleaned = val.slice(0, 3);
    setTextInput(cleaned);
    emitValue(cleaned, selectedColor);
  };

  const handleColorSelect = (hex) => {
    setSelectedColor(hex);
    emitValue(textInput, hex);
  };

  const handleFile = (e) => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { onChange(ev.target.result); setTextInput(""); };
    reader.readAsDataURL(file);
  };

  const previewText = textInput.trim().toUpperCase();

  return (
    <div className="space-y-3">
      <div className="flex gap-2 p-1 bg-slate-100 rounded-full border border-slate-200 w-fit">
        {[["text", "Short name"], ["upload", "Upload image"]].map(([m, label]) => (
          <button key={m} type="button" onClick={() => setMode(m)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ease-apple ${mode === m ? "bg-slate-50 shadow-sm text-indigo-900 ring-1 ring-slate-900/5" : "text-slate-500 hover:text-slate-700"}`}>
            {label}
          </button>
        ))}
      </div>

      {mode === "text" ? (
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200 ease-apple"
              style={{ backgroundColor: selectedColor, boxShadow: `0 4px 12px ${selectedColor}40` }}>
              {previewText
                ? <span style={{ fontSize: 18, fontWeight: 800, color: "white", letterSpacing: "0.03em" }}>{previewText}</span>
                : <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.45)" }}>AB</span>}
            </div>
            <div className="flex-1">
              <Input
                placeholder="e.g. HC, VLT, MH"
                value={textInput}
                onChange={e => handleTextInput(e.target.value)}
                className="font-bold tracking-widest uppercase text-base"
                maxLength={3}
              />
              <p className="text-[10px] text-slate-400 mt-1.5 ml-1">2–3 letters · pick a colour below</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            {ICON_COLORS.map(({ hex, label }) => (
              <button key={hex} type="button" title={label} aria-label={label} aria-pressed={selectedColor === hex} onClick={() => handleColorSelect(hex)}
                className="w-7 h-7 rounded-lg transition-all duration-150 ease-apple active:scale-95 flex items-center justify-center"
                style={{ backgroundColor: hex, boxShadow: selectedColor === hex ? `0 0 0 2px white, 0 0 0 4px ${hex}` : "none" }}>
                {selectedColor === hex && <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <input type="file" accept="image/*" ref={fileRef} className="hidden" onChange={handleFile} />
          <button type="button" onClick={() => fileRef.current?.click()}
            className="flex items-center gap-3 w-full px-4 py-3 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-sm text-slate-600 font-medium transition-all ease-apple active:scale-95">
            <Upload className="w-4 h-4 text-slate-400" />
            {value?.startsWith("data:") ? "Image selected — click to change" : "Choose image from your device"}
          </button>
          {value?.startsWith("data:") && (
            <div className="mt-3 flex items-center gap-3">
              <img src={value} alt="preview" className="w-12 h-12 rounded-xl object-cover border border-slate-200" />
              <button type="button" onClick={() => onChange("")} className="text-xs text-red-500 hover:text-red-700 font-medium">Remove</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const SliderDots = ({ total, current, onSelect, duration }) => {
  const [progress, setProgress] = useState(0);
  const animRef = useRef(null);
  const startRef = useRef(null);

  useEffect(() => {
    setProgress(0);
    startRef.current = null;
    if (animRef.current) cancelAnimationFrame(animRef.current);
    const animate = (ts) => {
      if (!startRef.current) startRef.current = ts;
      const pct = Math.min(((ts - startRef.current) / duration) * 100, 100);
      setProgress(pct);
      if (pct < 100) animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [current, duration]);

  return (
    <div className="flex gap-2 items-center justify-center">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          onClick={() => onSelect(i)}
          className="relative overflow-hidden rounded-full transition-all duration-300 ease-apple focus:outline-none"
          style={{ width: i === current ? 40 : 8, height: 6, background: "rgba(255,255,255,0.25)" }}
          aria-label={`Go to slide ${i + 1}`}
        >
          {i === current && (
            <div className="absolute inset-y-0 left-0 rounded-full bg-white" style={{ width: `${progress}%` }} />
          )}
          {i < current && (
            <div className="absolute inset-0 rounded-full bg-white/70" />
          )}
        </button>
      ))}
    </div>
  );
};

const SLIDES = [
  {
    tag: "Context switching",
    title: "Pick up exactly where you left off",
    desc: "Stop wasting time figuring out where you were. Continuum keeps your project context front and centre every time you return.",
    preview: (
      <div className="flex justify-center">
        <svg viewBox="0 0 420 260" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-sm opacity-95">
          <rect x="40" y="200" width="340" height="14" rx="7" fill="#FCD34D" opacity="0.25"/>
          <rect x="195" y="155" width="30" height="48" rx="4" fill="#FCD34D" opacity="0.3"/>
          <rect x="170" y="198" width="80" height="8" rx="4" fill="#FCD34D" opacity="0.3"/>
          <rect x="90" y="60" width="240" height="150" rx="12" fill="white" opacity="0.12"/>
          <rect x="90" y="60" width="240" height="150" rx="12" stroke="#FCD34D" strokeWidth="2.5" opacity="0.5"/>
          <rect x="104" y="74" width="212" height="122" rx="7" fill="#FCD34D" opacity="0.08"/>
          <rect x="118" y="90" width="80" height="8" rx="4" fill="#FCD34D" opacity="0.7"/>
          <rect x="118" y="108" width="140" height="5" rx="2.5" fill="white" opacity="0.35"/>
          <rect x="118" y="120" width="120" height="5" rx="2.5" fill="white" opacity="0.25"/>
          <rect x="118" y="132" width="100" height="5" rx="2.5" fill="white" opacity="0.2"/>
          <circle cx="272" cy="100" r="22" fill="#FCD34D" opacity="0.2"/>
          <circle cx="272" cy="100" r="22" stroke="#FCD34D" strokeWidth="2" opacity="0.6"/>
          <path d="M262 100 l7 7 l12-14" stroke="#FCD34D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.9"/>
          <path d="M200 160 l0 16 l4-5 l5 10 l3-1 l-5-10 l7 0 z" fill="#FCD34D" opacity="0.8"/>
          <rect x="310" y="30" width="95" height="60" rx="10" fill="white" opacity="0.1"/>
          <rect x="310" y="30" width="95" height="60" rx="10" stroke="#FCD34D" strokeWidth="1.5" opacity="0.4"/>
          <rect x="322" y="44" width="50" height="5" rx="2.5" fill="#FCD34D" opacity="0.6"/>
          <rect x="322" y="56" width="35" height="4" rx="2" fill="white" opacity="0.3"/>
          <rect x="322" y="66" width="42" height="4" rx="2" fill="white" opacity="0.2"/>
          <circle cx="64" cy="148" r="18" fill="#FCD34D" opacity="0.25"/>
          <path d="M40 200 q24-36 48 0" fill="#FCD34D" opacity="0.2"/>
          <circle cx="64" cy="148" r="18" stroke="#FCD34D" strokeWidth="1.5" opacity="0.5"/>
        </svg>
      </div>
    ),
  },
  {
    tag: "Questions",
    title: "Never lose track of a blocker",
    desc: "Log questions the moment they come up. Resolve them when you get answers. Full history always there.",
    preview: (
      <div className="flex justify-center">
        <svg viewBox="0 0 420 260" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-sm opacity-95">
          <rect x="60" y="30" width="240" height="110" rx="18" fill="white" opacity="0.1"/>
          <rect x="60" y="30" width="240" height="110" rx="18" stroke="#FCD34D" strokeWidth="2.5" opacity="0.55"/>
          <path d="M100 140 l-20 28 l36-18" fill="white" opacity="0.08"/>
          <path d="M100 140 l-20 28 l36-18" stroke="#FCD34D" strokeWidth="2" opacity="0.4"/>
          <text x="150" y="108" fontFamily="Georgia, serif" fontSize="72" fill="#FCD34D" opacity="0.8" textAnchor="middle">?</text>
          <rect x="230" y="140" width="140" height="70" rx="14" fill="white" opacity="0.08"/>
          <rect x="230" y="140" width="140" height="70" rx="14" stroke="#FCD34D" strokeWidth="1.5" opacity="0.35"/>
          <path d="M260 140 l-14-20 l28 8" fill="white" opacity="0.05"/>
          <path d="M260 140 l-14-20 l28 8" stroke="#FCD34D" strokeWidth="1.5" opacity="0.3"/>
          <rect x="248" y="160" width="70" height="5" rx="2.5" fill="#FCD34D" opacity="0.5"/>
          <rect x="248" y="172" width="50" height="4" rx="2" fill="white" opacity="0.25"/>
          <rect x="248" y="183" width="60" height="4" rx="2" fill="white" opacity="0.2"/>
          <circle cx="360" cy="55" r="26" fill="#FCD34D" opacity="0.18"/>
          <circle cx="360" cy="55" r="26" stroke="#FCD34D" strokeWidth="2" opacity="0.6"/>
          <path d="M348 55 l8 9 l16-18" stroke="#FCD34D" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity="0.9"/>
          <circle cx="360" cy="185" r="8" fill="#FCD34D" opacity="0.2"/>
          <circle cx="360" cy="185" r="8" stroke="#FCD34D" strokeWidth="1.5" opacity="0.4"/>
          <circle cx="380" cy="185" r="8" fill="white" opacity="0.08"/>
          <circle cx="380" cy="185" r="8" stroke="white" strokeWidth="1.5" opacity="0.2"/>
          <circle cx="400" cy="185" r="8" fill="white" opacity="0.08"/>
          <circle cx="400" cy="185" r="8" stroke="white" strokeWidth="1.5" opacity="0.2"/>
          <circle cx="50" cy="190" r="20" fill="#FCD34D" opacity="0.2"/>
          <circle cx="50" cy="190" r="20" stroke="#FCD34D" strokeWidth="1.5" opacity="0.45"/>
          <path d="M24 230 q26-32 52 0" fill="#FCD34D" opacity="0.15"/>
        </svg>
      </div>
    ),
  },
  {
    tag: "Resources",
    title: "Stop hunting through folders",
    desc: "Links, docs, and images — tagged and filterable, all in one place per project.",
    preview: (
      <div className="flex justify-center">
        <svg viewBox="0 0 420 260" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-sm opacity-95">
          <rect x="200" y="60" width="170" height="130" rx="12" fill="#FCD34D" opacity="0.12"/>
          <rect x="200" y="60" width="170" height="130" rx="12" stroke="#FCD34D" strokeWidth="2" opacity="0.3"/>
          <path d="M200 80 l170 0" stroke="#FCD34D" strokeWidth="1.5" opacity="0.3"/>
          <path d="M200 73 q0-13 13-13 l40 0 q6 0 8 6 l4 7 l105 0" stroke="#FCD34D" strokeWidth="2" opacity="0.35" fill="none"/>
          <rect x="80" y="80" width="170" height="130" rx="12" fill="white" opacity="0.08"/>
          <rect x="80" y="80" width="170" height="130" rx="12" stroke="#FCD34D" strokeWidth="2" opacity="0.45"/>
          <path d="M80 100 l170 0" stroke="#FCD34D" strokeWidth="1.5" opacity="0.4"/>
          <path d="M80 93 q0-13 13-13 l40 0 q6 0 8 6 l4 7 l105 0" stroke="#FCD34D" strokeWidth="2" opacity="0.5" fill="none"/>
          <rect x="100" y="115" width="90" height="5" rx="2.5" fill="#FCD34D" opacity="0.55"/>
          <rect x="100" y="128" width="70" height="4" rx="2" fill="white" opacity="0.3"/>
          <rect x="100" y="140" width="80" height="4" rx="2" fill="white" opacity="0.22"/>
          <rect x="100" y="152" width="60" height="4" rx="2" fill="white" opacity="0.18"/>
          <circle cx="210" cy="145" r="18" fill="#FCD34D" opacity="0.15"/>
          <circle cx="210" cy="145" r="18" stroke="#FCD34D" strokeWidth="1.5" opacity="0.5"/>
          <path d="M204 145 q0-6 6-6 l8 0 q6 0 6 6 q0 6-6 6 l-8 0 q-6 0-6-6z" stroke="#FCD34D" strokeWidth="1.5" fill="none" opacity="0.8"/>
          <line x1="207" y1="145" x2="213" y2="145" stroke="#FCD34D" strokeWidth="1.5" opacity="0.8"/>
          <rect x="94" y="168" width="40" height="16" rx="8" fill="#FCD34D" opacity="0.25"/>
          <rect x="140" y="168" width="48" height="16" rx="8" fill="white" opacity="0.1"/>
          <circle cx="360" cy="185" r="22" fill="#FCD34D" opacity="0.2"/>
          <circle cx="360" cy="185" r="22" stroke="#FCD34D" strokeWidth="1.5" opacity="0.5"/>
          <path d="M330 230 q30-36 60 0" fill="#FCD34D" opacity="0.15"/>
          <path d="M342 185 q-30-20-60-40" stroke="#FCD34D" strokeWidth="2.5" strokeLinecap="round" opacity="0.4"/>
          <circle cx="282" cy="145" r="5" fill="#FCD34D" opacity="0.6"/>
        </svg>
      </div>
    ),
  },
];

const LoginScreen = ({ onGoogleLogin, onEmailAuth, onMagicLink, onDemo, loading, error }) => {
  const [slide, setSlide] = useState(0);
  const [authMode, setAuthMode] = useState("magic");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState("main");
  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setSlide(s => (s + 1) % SLIDES.length), SLIDE_DURATION);
    return () => clearTimeout(timer);
  }, [slide]);

  const handleEmailSubmit = async () => {
    if (!email.trim()) return;
    setLocalLoading(true); setLocalError("");
    try {
      if (authMode === "magic") { await onMagicLink(email); setStep("sent"); }
      else await onEmailAuth(email, password);
    } catch (err) { setLocalError(err.message || "Something went wrong."); }
    setLocalLoading(false);
  };

  const currentSlide = SLIDES[slide];

  return (
    <div className="login-shell md:flex md:flex-row md:h-screen md:overflow-hidden bg-white min-h-screen w-full">
      <div className="md:flex-1 md:overflow-hidden">
        <div className="md:hidden" style={{ padding: "10px 10px 0 10px" }}>
          <div className="bg-indigo-600 rounded-[16x] px-8 py-7 flex flex-col gap-4" style={{ height: 220 }}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                <ContinuumLogo className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-extrabold text-lg tracking-tight">Continuum</span>
            </div>
            <div style={{ height: 100 }} className="w-full overflow-hidden">
              <p className="t-eyebrow text-indigo-300 mb-1">{currentSlide.tag}</p>
              <h2 className="text-base font-extrabold text-white leading-tight tracking-tight mb-1">{currentSlide.title}</h2>
              <p className="text-xs text-indigo-200 leading-relaxed line-clamp-2">{currentSlide.desc}</p>
            </div>
            <SliderDots total={SLIDES.length} current={slide} onSelect={setSlide} duration={SLIDE_DURATION} />
          </div>
        </div>
        <div className="hidden md:block h-full" style={{ padding: "10px 10px 10px 0" }}>
          <div className="h-full bg-indigo-600 rounded-[40px] overflow-hidden relative flex flex-col justify-center">
            <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 80% 10%, rgba(255,255,255,0.07) 0%, transparent 50%)" }} />
            <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 20% 90%, rgba(99,102,241,0.5) 0%, transparent 50%)" }} />
            <div className="relative z-10 flex flex-col px-16 py-16" style={{ maxWidth: 600, margin: "0 auto", width: "100%" }}>
              <div style={{ minHeight: 180 }} className="w-full">
                <p className="t-eyebrow text-indigo-300 mb-3">{currentSlide.tag}</p>
                <h2 className="text-3xl font-extrabold text-white leading-tight tracking-tight mb-3">{currentSlide.title}</h2>
                <p className="text-sm text-indigo-200 leading-relaxed">{currentSlide.desc}</p>
              </div>
              <div key={slide + "-art"} className="animate-in fade-in duration-700 w-full mb-8">
                {currentSlide.preview}
              </div>
              <div className="w-full flex justify-center">
                <SliderDots total={SLIDES.length} current={slide} onSelect={setSlide} duration={SLIDE_DURATION} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col bg-white items-center md:overflow-y-auto md:flex-none md:w-1/2" style={{ padding: "40px 32px 48px" }}>
        <div className="flex flex-col flex-1 w-full" style={{ maxWidth: 440 }}>
          <div className="hidden md:flex items-center gap-3 shrink-0">
            <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <ContinuumLogo className="w-8 h-8 text-white" />
            </div>
            <span className="text-slate-900 font-extrabold text-xl tracking-tight">Continuum</span>
          </div>
          <div className="md:flex-1 md:flex md:flex-col md:justify-center">
            <div className="w-full pt-10 md:pt-0">
            {step === "main" ? (
              <>
                <p className="t-eyebrow text-slate-400 mb-2">Your creative second brain</p>
               <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">A little less catching up.</h1>
                <p className="text-sm text-slate-500 leading-relaxed mb-8">Your projects, context, and tasks. All in one place.</p>
                {(error || localError) && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-2xl text-xs flex items-center gap-2 mb-5">
                    <AlertCircle className="w-4 h-4 shrink-0" /><p>{error || localError}</p>
                  </div>
                )}
                <div className="flex gap-1.5 p-1 bg-slate-100 rounded-full border border-slate-200 mb-4">
                  {[["magic", "Magic link", "No password"], ["password", "Password", "Traditional"]].map(([mode, label, sub]) => (
                    <button key={mode} onClick={() => setAuthMode(mode)}
                      className={`flex-1 py-2 px-3 rounded-full text-xs font-bold transition-all duration-200 ease-apple ${authMode === mode ? "bg-white shadow-sm text-indigo-900 ring-1 ring-slate-900/5" : "text-slate-500 hover:text-slate-700"}`}>
                      {label}<span className="block text-[10px] font-medium mt-0.5 opacity-60">{sub}</span>
                    </button>
                  ))}
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-500 mb-4 leading-relaxed">
                  {authMode === "magic"
                    ? "We'll send a sign-in link to your email. Click it and you're in — no password ever."
                    : "Enter your email and password. New here? We'll create your account automatically."}
                </div>
                <Input type="email" aria-label="Email address" autoComplete="email" placeholder="Your email address" value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") handleEmailSubmit(); }}
                  className="mb-3" />
                {authMode === "password" && (
                  <div className="mb-1">
                    <Input type="password" aria-label="Password" autoComplete="current-password" placeholder="Password" value={password}
                      onChange={e => setPassword(e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter") handleEmailSubmit(); }}
                      className="mb-2" />
                    <div className="flex justify-end mb-4">
                      <button
                        type="button"
                        onClick={async () => {
                          if (!email.trim()) { setLocalError("Enter your email address first."); return; }
                          try {
                            await sendPasswordResetEmail(auth, email);
                            setStep("resetSent");
                          } catch (err) {
                            setLocalError(err.code === "auth/user-not-found" ? "No account found with that email." : "Failed to send reset email. Try again.");
                          }
                        }}
                        className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold transition-colors">
                        Forgot password?
                      </button>
                    </div>
                  </div>
                )}
                <Button variant="primary" className="w-full py-3.5 mb-4" onClick={handleEmailSubmit} disabled={localLoading || loading}>
                  {localLoading
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
                    : authMode === "magic" ? <><Send className="w-4 h-4" /> Send magic link</> : "Continue"}
                </Button>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-1 h-px bg-slate-200" />
                  <span className="t-eyebrow text-slate-400">or</span>
                  <div className="flex-1 h-px bg-slate-200" />
                </div>
                <Button variant="google" className="w-full py-3.5 mb-3" onClick={onGoogleLogin} disabled={loading}>
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Connecting...</> : (
                    <><svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>Continue with Google</>
                  )}
                </Button>
                <button onClick={onDemo}
                  className="w-full py-3.5 rounded-full border border-indigo-200 bg-indigo-50 text-indigo-700 text-sm font-bold hover:bg-indigo-100 transition-all ease-apple active:scale-95 flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                  Explore with demo data
                </button>
                <p className="text-[11px] text-slate-400 text-center mt-3">No account needed · Data won't be saved</p>
              </>
            ) : step === "sent" ? (
              <>
                <button onClick={() => setStep("main")} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-indigo-600 transition-colors mb-10 min-h-[44px]">
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>
                <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6">
                  <Mail className="w-7 h-7 text-indigo-600" />
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-3">Check your inbox</h2>
                <p className="text-sm text-slate-500 leading-relaxed mb-6">
                  We sent a sign-in link to <strong className="text-slate-800">{email}</strong>. Click it and you're in.
                </p>
                <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-500 leading-relaxed">
                  Didn't get it? Check your spam, or{" "}
                  <button onClick={handleEmailSubmit} className="text-indigo-600 font-semibold hover:underline">resend the link.</button>
                </div>
              </>
            ) : (
              <>
                <button onClick={() => setStep("main")} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-indigo-600 transition-colors mb-10 min-h-[44px]">
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>
                <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6">
                  <CheckSquare className="w-7 h-7 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-3">Password reset sent</h2>
                <p className="text-sm text-slate-500 leading-relaxed mb-6">
                  We sent a password reset link to <strong className="text-slate-800">{email}</strong>. Check your inbox and follow the instructions.
                </p>
                <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-500 leading-relaxed">
                  Didn't get it? Check your spam, or{" "}
                  <button
                    onClick={async () => { try { await sendPasswordResetEmail(auth, email); } catch(e) {} }}
                    className="text-indigo-600 font-semibold hover:underline">resend the email.</button>
                </div>
              </>
            )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DemoBanner = ({ onSignIn }) => (
  <div className="ds-demo-banner bg-indigo-600 text-slate-50 px-6 py-2.5 flex items-center justify-between shrink-0 z-30 gap-3">
    <p className="text-xs font-semibold">Exploring demo data — nothing is saved.</p>
    <button onClick={onSignIn} className="text-xs font-bold bg-slate-50 text-indigo-700 px-4 py-1.5 rounded-full hover:bg-indigo-50 transition-colors active:scale-95 ease-apple shrink-0">
      Sign in to save your work
    </button>
  </div>
);

const ResourceModal = ({ isOpen, onClose, onSubmit, resource = null }) => {
  const [tagDraft, setTagDraft] = useState("");
  const form = useDialogForm({ title: resource?.title || "", url: resource?.url || "", description: resource?.description || "", tags: resource?.tags || [] }, values => {
    const errors = {};
    if (!values.title.trim()) errors.title = "Enter a resource title.";
    else if (values.title.trim().length > 300) errors.title = "Keep the title to 300 characters or fewer.";
    if (!values.url.trim()) errors.url = "Enter a web address.";
    else if (!resourceURL(values.url.trim())) errors.url = "Use a complete http:// or https:// address.";
    return errors;
  }, values => onSubmit({ ...values, title: values.title.trim(), url: values.url.trim(), id: resource?.id || null, type: resource?.type || "link" }), onClose);
  if (!isOpen) return null;
  const tags = [...new Set([...DEFAULT_TAGS, ...form.values.tags])];
  const toggleTag = tag => form.setValue("tags", form.values.tags.includes(tag) ? form.values.tags.filter(value => value !== tag) : [...form.values.tags, tag]);
  const addTag = () => { const tag = tagDraft.trim(); if (tag && !form.values.tags.includes(tag)) form.setValue("tags", [...form.values.tags, tag]); setTagDraft(""); };
  return <FormDialog title={resource ? "Edit resource" : "Add resource"} description="Keep useful links and context together. Fields marked * are required." onClose={onClose} onSubmit={form.submit} busy={form.busy} error={form.formError} submitLabel={resource ? "Save changes" : "Add resource"}>
    <Field label="Title" required autoFocus value={form.values.title} onChange={e => form.setValue("title", e.target.value)} onBlur={() => form.blur("title")} error={form.error("title")} maxLength={300} placeholder="e.g. Content audit template" />
    <Field label="Web address" required value={form.values.url} onChange={e => form.setValue("url", e.target.value)} onBlur={() => form.blur("url")} error={form.error("url")} hint="Include https:// so the link opens correctly." type="url" placeholder="https://…" />
    <Field label="Description" multiline rows={3} value={form.values.description} onChange={e => form.setValue("description", e.target.value)} hint="A short reminder of why this resource is useful." />
    <div className="ds-field"><span className="ds-field-label" id="resource-tags-label">Tags<span className="ds-field-optional">Optional</span></span><div className="ds-tag-options" role="group" aria-labelledby="resource-tags-label">{tags.map(tag => <button key={tag} type="button" className="ds-chip" aria-pressed={form.values.tags.includes(tag)} onClick={() => toggleTag(tag)}>{form.values.tags.includes(tag) && <CheckCircle2 size={16} />}{tag}</button>)}</div><div className="ds-add-tag"><label className="sr-only" htmlFor="resource-custom-tag">New tag</label><input id="resource-custom-tag" className="ds-field-control" value={tagDraft} maxLength={40} placeholder="Create a tag" onChange={e => setTagDraft(e.target.value)} onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }} /><button type="button" className="ds-text-button" disabled={!tagDraft.trim()} onClick={addTag}>Add tag</button></div><p className="ds-field-support">Choose tags to make this resource easier to find.</p></div>
  </FormDialog>;
};

const ProjectModal = ({ isOpen, onClose, project, onSubmit, onDelete }) => {
  const [deleting, setDeleting] = useState(false);
  const form = useDialogForm({ title: project?.title || "", client: project?.client || "", startDate: project?.startDate || "", description: project?.description || "", icon: project?.icon || "" }, values => {
    const errors = {};
    if (!values.title.trim()) errors.title = "Enter a project name.";
    if (!values.client.trim()) errors.client = "Enter a client or workspace name.";
    if (values.startDate && !/^\d{4}-\d{2}-\d{2}$/.test(values.startDate)) errors.startDate = "Choose a valid start date.";
    return errors;
  }, values => onSubmit({ ...values, title: values.title.trim(), client: values.client.trim() }), onClose);
  if (!isOpen) return null;
  const remove = async () => { if (!window.confirm("Delete this project?")) return; setDeleting(true); try { if (await onDelete(project.id)) onClose(); else form.setFormError("The project could not be deleted. Please try again."); } catch { form.setFormError("The project could not be deleted. Please try again."); } finally { setDeleting(false); } };
  return <FormDialog title={project ? "Edit project" : "New project"} description="Give your project a clear home. Fields marked * are required." onClose={onClose} onSubmit={form.submit} busy={form.busy || deleting} busyLabel={deleting ? "Deleting…" : "Saving…"} error={form.formError} submitLabel={project ? "Save changes" : "Create project"} secondaryAction={project && <button type="button" className="ds-text-button ds-danger" disabled={form.busy || deleting} onClick={remove}>Delete project</button>}>
    <Field label="Project name" required autoFocus value={form.values.title} maxLength={300} placeholder="e.g. Harlow website redesign" onChange={e => form.setValue("title", e.target.value)} onBlur={() => form.blur("title")} error={form.error("title")} />
    <Field label="Client or workspace" required value={form.values.client} maxLength={160} placeholder="e.g. Harlow & Co." onChange={e => form.setValue("client", e.target.value)} onBlur={() => form.blur("client")} error={form.error("client")} />
    <Field label="Start date" type="date" value={form.values.startDate} onChange={e => form.setValue("startDate", e.target.value)} onBlur={() => form.blur("startDate")} error={form.error("startDate")} />
    <Field label="Description" multiline rows={3} value={form.values.description} onChange={e => form.setValue("description", e.target.value)} hint="What is this project working toward?" />
    <div className="ds-field"><span className="ds-field-label">Project icon<span className="ds-field-optional">Optional</span></span><IconPicker value={form.values.icon} onChange={value => form.setValue("icon", value)} /></div>
  </FormDialog>;
};

const WhereIAmCard = ({ project, onUpdate, onDirty, isDemo }) => {
  const [local, setLocal] = useState(project?.whereIAm || "");
  const pending = useRef(null), timer = useRef(null), save = useRef(onUpdate);
  save.current = onUpdate;
  const flush = () => { clearTimeout(timer.current); if (pending.current !== null) { const value = pending.current; pending.current = null; save.current({ whereIAm: value }); } };
  useEffect(() => {
    const hidden = () => { if (document.hidden) flush(); };
    document.addEventListener("visibilitychange", hidden);
    window.addEventListener("pagehide", flush);
    return () => { document.removeEventListener("visibilitychange", hidden); window.removeEventListener("pagehide", flush); flush(); };
  }, []);
  return <div className="context-card current-context bg-slate-50 border border-slate-200 p-8">
    <div className="flex items-center gap-2.5 mb-4"><div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center"><Clock className="w-3.5 h-3.5 text-indigo-500" /></div><span className="t-eyebrow">Where you left off</span><span className="text-xs text-slate-400 ml-auto">Autosaves</span></div>
    <textarea aria-label="Where you left off" className="w-full bg-transparent text-sm text-slate-700 leading-relaxed resize-y min-h-[120px] rounded-md p-2 focus:outline-indigo-300" placeholder="Where things stand, what just happened, what to pick up next…" value={local} onBlur={flush} onChange={e => { setLocal(e.target.value); onDirty?.(); pending.current = e.target.value; clearTimeout(timer.current); timer.current = setTimeout(flush, 700); }} />
  </div>;
};

const NotesCard = ({ project, onUpdate, isDemo }) => {
  // Read older freeform notes as checklist rows without changing stored data on load.
  const readItems = () => {
    const saved = project?.dontForgetItems || [];
    if (project?.dontForgetMode === "checklist" && saved.length) return saved;
    const legacy = (project?.dontForget || "").split("\n").filter(line => line.trim()).map((text, index) => ({ id: `legacy-note-${index}`, text, checked: false }));
    return [...saved, ...legacy];
  };
  const listMotion = useListMotion();
  const [items, setItems] = useState(readItems);
  const [noteError, setNoteError] = useState("");
  const [notesSaving, setNotesSaving] = useState(false);
  const [newItem, setNewItem] = useState("");
  const [editingNoteId, setEditingNoteId] = useState(null), [noteDraft, setNoteDraft] = useState(""), [editError, setEditError] = useState("");
  const closeNoteEditor = () => { const id = editingNoteId; setEditingNoteId(null); setEditError(""); requestAnimationFrame(() => document.getElementById(`edit-note-${id}`)?.focus()); };
  const saveNoteEdit = async event => {
    event.preventDefault();
    if (notesSaving) return;
    if (!noteDraft.trim()) { setEditError("Enter a note before saving."); return; }
    if (await saveItems(items.map(item => item.id === editingNoteId ? { ...item, text: noteDraft.trim() } : item))) closeNoteEditor();
  };
  useEffect(() => { setItems(readItems()); setNewItem(""); setEditingNoteId(null); setEditError(""); }, [project?.id]);
  const saveItems = async updated => {
    if (notesSaving) return;
    const previous = items; setItems(updated); setNotesSaving(true); setNoteError("");
    try { if (await onUpdate({ dontForgetItems: updated, dontForgetMode: "checklist", dontForget: "" }) === false) { setItems(previous); setNoteError("Could not save your notes. Please try again."); return false; } return true; }
    catch { setItems(previous); setNoteError("Could not save your notes. Please try again."); return false; }
    finally { setNotesSaving(false); }
  };
  const addItem = async () => {
    if (!newItem.trim() || notesSaving) return;
    if (await saveItems([...items, { id: generateId(), text: newItem.trim(), checked: false }])) setNewItem("");
  };
  return (
    <div className="context-card notes-card bg-slate-50 border border-slate-200 p-8">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center"><CheckSquare className="w-3.5 h-3.5 text-indigo-600" /></div>
        <span className="t-eyebrow">Notes & reminders</span>
        <span className="notes-progress">{items.filter(item => item.checked).length} of {items.length} checked</span>
      </div>
      {noteError && <p className="ds-form-error" role="alert">{noteError}</p>}
      <div className="space-y-2" ref={listMotion}>
        {[...items].sort((a, b) => Number(a.checked) - Number(b.checked)).map(item => (
          <div key={item.id} data-motion-id={item.id} className="note-row flex items-center gap-3 group">
            <AnimatedCheckbox aria-label={item.text} checked={item.checked} disabled={notesSaving || editingNoteId !== null}
              onChange={() => saveItems(items.map(row => row.id === item.id ? { ...row, checked: !row.checked } : row))} />
            {editingNoteId === item.id ? <form className="note-inline-editor" onSubmit={saveNoteEdit}>
              <label className="sr-only" htmlFor={`note-draft-${item.id}`}>Edit note text</label>
              <textarea id={`note-draft-${item.id}`} className="ds-field-control" rows={2} autoFocus value={noteDraft} disabled={notesSaving} aria-invalid={!!editError} aria-describedby={editError ? `note-error-${item.id}` : undefined} onChange={event => { setNoteDraft(event.target.value); setEditError(""); }} onKeyDown={event => { if (event.key === "Escape" && !notesSaving) { event.preventDefault(); closeNoteEditor(); } if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) { event.preventDefault(); event.currentTarget.form.requestSubmit(); } }} />
              {editError && <p className="ds-field-support" id={`note-error-${item.id}`} role="alert">{editError}</p>}
              <div className="note-edit-actions"><button type="button" className="ds-text-button" disabled={notesSaving} onClick={closeNoteEditor}>Cancel</button><button type="submit" className="ws-primary" disabled={notesSaving}>{notesSaving ? "Saving…" : "Save note"}</button></div>
            </form> : <><span className={`text-sm flex-1 leading-relaxed ${item.checked ? "line-through text-slate-400" : "text-slate-700"}`}>{item.text}</span><button id={`edit-note-${item.id}`} type="button" className="ds-icon-button" disabled={notesSaving || editingNoteId !== null} aria-label={`Edit note: ${item.text}`} title="Edit note" onClick={() => { setEditingNoteId(item.id); setNoteDraft(item.text); setEditError(""); setNoteError(""); }}><Edit2 size={16} /></button><button type="button" disabled={notesSaving || editingNoteId !== null} aria-label={`Delete note: ${item.text}`} onClick={() => saveItems(items.filter(row => row.id !== item.id))} className="ds-icon-button note-delete"><Trash2 size={16} /></button></>}

          </div>
        ))}
        {!items.length && <p className="text-sm text-slate-400 py-3">A clear space for your project notes.</p>}
        {items.some(item => item.checked) && <div className="notes-list-actions"><button type="button" disabled={notesSaving || editingNoteId !== null} className="ds-text-button" onClick={() => saveItems(items.filter(item => !item.checked))}>Clear checked</button></div>}
        {<form className="flex items-center gap-3 pt-4 mt-4 border-t border-slate-200" onSubmit={e => { e.preventDefault(); addItem(); }}>
          <Plus size={17} className="text-slate-400" />
          <input aria-label="New note" className="min-w-0 flex-1 bg-transparent text-sm outline-none py-2" placeholder="Add a note…" value={newItem} onChange={e => setNewItem(e.target.value)} />
          <Button type="submit" disabled={notesSaving || !newItem.trim()} className="px-4 py-2 text-xs">Add note</Button>
        </form>}
      </div>
    </div>
  );
};

const ResolutionDialog = ({ question, onSave, onClose }) => {
  const form = useDialogForm({ resolution: question.resolution || "" }, values => values.resolution.trim() ? {} : { resolution: "Add the answer or decision that resolved this question." }, values => onSave(values.resolution.trim()), onClose);
  return <FormDialog title="Resolve question" description={question.content} onClose={onClose} onSubmit={form.submit} busy={form.busy} error={form.formError} submitLabel="Save resolution"><Field label="What was the resolution?" required multiline autoFocus rows={4} value={form.values.resolution} onChange={e => form.setValue('resolution', e.target.value)} onBlur={() => form.blur('resolution')} error={form.error('resolution')} hint="This answer will be saved in resolved questions." /></FormDialog>;
};

const OverviewTab = ({ project, onUpdate, onDirty, onUpdateCtx, isDemo }) => {
  const [resolving, setResolving] = useState(null);
  const [resolvedNotice, setResolvedNotice] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState("");


  const addQuestion = (content) => {
    if (!content.trim()) return;
    const newNote = { id: generateId(), type: "question", content, timestamp: new Date().toLocaleDateString(), isResolved: false };
    onUpdateCtx("notes", [newNote, ...(project.notes || [])]);
  };
  const deleteNote = (id) => { onUpdateCtx("notes", (project.notes || []).filter(n => n.id !== id)); };
  const toggleNoteRes = (id) => { const note = (project.notes || []).find(n => n.id === id); if (!note) return; if (!note.isResolved) setResolving(note); else onUpdateCtx("notes", (project.notes || []).map(n => n.id === id ? { ...n, isResolved: false } : n)); };
  const startEditing = (note, e) => {
    e.stopPropagation(); setEditingId(note.id); setEditContent(note.content);
  };
  const saveEdit = () => {
    if (editContent.trim()) onUpdateCtx("notes", (project.notes || []).map(n => n.id === editingId ? { ...n, content: editContent } : n));
    setEditingId(null);
  };

  const activeQuestions = (project.notes || []).filter(n => !n.isResolved && n.type === "question");
  const resolvedQuestions = (project.notes || []).filter(n => n.isResolved && n.type === "question");

  return (
    <div className="overview-content space-y-6">
      {resolving && <ResolutionDialog question={resolving} onClose={() => setResolving(null)} onSave={async resolution => { const id = resolving.id; const saved = await onUpdateCtx("notes", (project.notes || []).map(note => note.id === id ? { ...note, isResolved: true, resolution, resolvedAt: new Date().toISOString() } : note)); if (saved !== false) setResolvedNotice(id); return saved; }} />}
      <div className="context-grid grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WhereIAmCard project={project} onUpdate={onUpdate} onDirty={onDirty} isDemo={isDemo} />
        <NotesCard project={project} onUpdate={onUpdate} isDemo={isDemo} />
      </div>
      {resolvedNotice && <div className="resolution-feedback" role="status"><CheckCircle2 size={18} /><span>Question resolved. Answer saved.</span><button className="ds-text-button" onClick={() => { setShowHistory(true); requestAnimationFrame(() => document.getElementById(`answer-${resolvedNotice}`)?.focus()); }}>View answer</button><button className="ds-icon-button" aria-label="Dismiss resolution message" onClick={() => setResolvedNotice(null)}><X size={16} /></button></div>}
      <div id="project-questions" className="context-card questions-card bg-slate-50 rounded-[24px] shadow-sm border border-slate-200 p-8 shadow-md shadow-slate-200/50">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-7 h-7 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
            <MessageCircle className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <span className="t-eyebrow text-amber-700">Open questions <span className="question-count">{activeQuestions.length}</span></span>
        </div>
        {(
          <div className="flex gap-3 mb-6">
            <Input id="new-question" placeholder="What do you need to ask?"
              className="focus:ring-amber-200 focus:border-amber-300"
              onKeyDown={e => { if (e.key === "Enter") { addQuestion(e.target.value); e.target.value = ""; } }} />
            <Button variant="amber" className="shrink-0 px-5"
              onClick={() => { const el = document.getElementById("new-question"); addQuestion(el.value); el.value = ""; }}>
              <Plus className="w-4 h-4" /> Add
            </Button>
          </div>
        )}
        {activeQuestions.length === 0 ? (
          <div className="text-center py-16 bg-slate-100/60 rounded-[32px] border-2 border-dashed border-slate-200">
            <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-amber-300" />
            </div>
            <p className="text-slate-400 font-medium">No open questions.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activeQuestions.map(note => (
              <div key={note.id} className="group bg-slate-50 rounded-[24px] border border-slate-200 p-6 hover:shadow-md transition-all duration-300 ease-apple">
                <div className="flex items-start gap-5">
                  <div className="mt-1 shrink-0">
                    <button aria-label="Mark question as resolved" onClick={() => toggleNoteRes(note.id)}
                      className="w-10 h-10 rounded-full border-2 border-amber-100 text-amber-600 bg-amber-50 flex items-center justify-center hover:bg-amber-100 hover:scale-110 transition-all ease-apple">
                      <Circle className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-3">
                      <Badge color="amber">question</Badge>
                      <span className="t-meta text-slate-400">{note.timestamp}</span>
                    </div>
                    {editingId === note.id ? (
                      <div className="mt-2 bg-slate-100 p-4 rounded-2xl">
                        <TextArea className="bg-slate-50" value={editContent} onChange={e => setEditContent(e.target.value)} rows={3} autoFocus />
                        <div className="flex gap-3 mt-4 justify-end">
                          <Button variant="tertiary" onClick={() => setEditingId(null)} className="px-4 py-2 text-xs">Cancel</Button>
                          <Button variant="primary" onClick={saveEdit} className="px-4 py-2 text-xs">Save</Button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-slate-800 text-base leading-relaxed whitespace-pre-wrap font-normal break-words">{note.content}</p>
                    )}
                  </div>
                 {(
  <div className="flex gap-1 -mr-2 shrink-0">
    <Button variant="icon" onClick={e => startEditing(note, e)} className="opacity-0 group-hover:opacity-100 hover:bg-slate-100 hover:text-indigo-600">
      <Edit2 className="w-4 h-4" />
    </Button>
    <Button variant="icon" onClick={e => { e.stopPropagation(); deleteNote(note.id); }} className="opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-500">
      <Trash2 className="w-4 h-4" />
    </Button>
  </div>
)}
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="pt-10 mt-10 border-t border-slate-200/60">
          <button onClick={() => setShowHistory(!showHistory)}
            className="t-eyebrow text-slate-400 flex items-center gap-2 hover:text-indigo-600 transition-colors mb-6">
            {showHistory ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            Resolved questions {resolvedQuestions.length > 0 && `(${resolvedQuestions.length})`}
          </button>
          {showHistory && (
            <div className="space-y-4 pl-6 border-l-2 border-slate-200">
              {resolvedQuestions.length === 0 ? (
                <p className="text-sm text-slate-400 italic">No resolved questions yet.</p>
              ) : resolvedQuestions.map(note => (
                <div id={`answer-${note.id}`} tabIndex={-1} key={note.id} className="opacity-60 hover:opacity-100 transition-opacity flex items-center gap-3 bg-slate-100 p-5 rounded-2xl">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  <div className="resolved-question-copy"><p className="text-sm text-slate-600">{note.content}</p><p className="question-resolution"><strong>Resolution</strong><span>{note.resolution || "No resolution was recorded for this question."}</span></p></div>
                  {<Button variant="tertiary" onClick={() => toggleNoteRes(note.id)} className="text-xs px-2 py-1 shrink-0 flex items-center gap-1.5"><RotateCcw className="w-3 h-3" />Undo</Button>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [successMessage, setSuccessMessage] = useState(null);
  const notifySuccess = text => setSuccessMessage({ text, id: Date.now() });
  useEffect(() => { if (!successMessage) return; const timeout = setTimeout(() => setSuccessMessage(null), 6000); return () => clearTimeout(timeout); }, [successMessage]);
  const [focusOpenRequest, setFocusOpenRequest] = useState(0);
  const [user, setUser] = useState(null);
  const [isDemo, setIsDemo] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [projects, setProjects] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [view, setView] = useState("dashboard");
  const [taskEditor, setTaskEditor] = useState(null);
  const [projectLoading, setProjectLoading] = useState(false);
  const [projectError, setProjectError] = useState("");
  const [saveStates, setSaveStates] = useState({});
  const saveSequence = useRef({});
  const workspace = useWorkspace(db, user?.uid, isDemo);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [isSidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= 1440);
  const drawerRef = useRef(null);
  const [isCompletedExpanded, setIsCompletedExpanded] = useState(false);
  const [projectSearch, setProjectSearch] = useState("");
  const [isResourceModalOpen, setIsResourceModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [editingResource, setEditingResource] = useState(null);

  useEffect(() => {
    if (!isSidebarOpen || window.innerWidth >= 768 || (!user && !isDemo)) return;
    const previous = document.activeElement;
    const drawer = drawerRef.current;
    const controls = () => [...(drawer?.querySelectorAll('button, input, a[href], select') || [])].filter(el => !el.disabled && el.offsetParent !== null);
    controls()[0]?.focus();
    const handleKey = e => {
      if (e.key === "Escape") { e.preventDefault(); setSidebarOpen(false); }
      if (e.key === "Tab") {
        const items = controls(), first = items[0], last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
      }
    };
    drawer?.addEventListener("keydown", handleKey);
    return () => { drawer?.removeEventListener("keydown", handleKey); if (previous?.isConnected) previous.focus(); };
  }, [isSidebarOpen, user, isDemo]);

  useEffect(() => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      const email = window.localStorage.getItem("emailForSignIn");
      if (email) {
        signInWithEmailLink(auth, email, window.location.href)
          .then(() => { window.localStorage.removeItem("emailForSignIn"); window.history.replaceState({}, document.title, "/"); })
          .catch(err => console.error(err));
      }
    }
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, currentUser => {
      if (currentUser && currentUser.isAnonymous) { signOut(auth); return; }
      setUser(currentUser); setLoading(false);
      if (currentUser) {
        setAuthError(null); setIsDemo(false);
        if (typeof chrome !== "undefined" && chrome.storage) {
          chrome.storage.local.set({
            continuumUser: {
              uid: currentUser.uid,
              email: currentUser.email,
              displayName: currentUser.displayName,
              photoURL: currentUser.photoURL,
            }
          });
        }
      } else {
        if (typeof chrome !== "undefined" && chrome.storage) {
          chrome.storage.local.remove("continuumUser");
        }
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!user || isDemo) return;
    setProjectLoading(true); setProjectError("");
    const ref = collection(db, "artifacts", appId, "users", user.uid, "projects");
    const unsub = onSnapshot(query(ref), snapshot => {
      const loaded = snapshot.docs.map(d => ({ notes: [], resources: [], ...d.data(), id: d.id }));
      setProjectLoading(false);
      setProjects(loaded);
      if (loaded.length > 0) setSelectedId(prev => loaded.find(p => p.id === prev) ? prev : loaded[0].id);
    }, err => { setProjectLoading(false); setProjectError("Could not load projects. Check your connection and Firebase permissions."); });
    return () => unsub();
  }, [user, isDemo]);

  const handleGoogleLogin = async () => {
    setLoading(true); setAuthError(null);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const EXTENSION_ID = "epmmpemgjknjdogfbdclgjfnmiedlmap";
      if (token && window.chrome?.runtime) {
        chrome.runtime.sendMessage(
          EXTENSION_ID,
          { type: 'LOGIN_SUCCESS', token },
          () => { if (chrome.runtime.lastError) {} }
        )
      }
    } catch (err) {
      if (err.code === "auth/unauthorized-domain") setAuthError("Domain not authorized in Firebase.");
      else if (err.code === "auth/popup-closed-by-user") setAuthError("Sign-in cancelled.");
      else setAuthError("Failed to sign in. Please try again.");
      setLoading(false);
    }
  };

  const handleEmailAuth = async (email, password) => {
    try {
      const methods = await fetchSignInMethodsForEmail(auth, email);
      if (methods.length === 0) await createUserWithEmailAndPassword(auth, email, password);
      else await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      throw new Error(
        err.code === "auth/wrong-password" ? "Incorrect password." :
        err.code === "auth/weak-password" ? "Password must be at least 6 characters." :
        "Something went wrong. Please try again."
      );
    }
  };

  const handleMagicLink = async (email) => {
    await sendSignInLinkToEmail(auth, email, { url: window.location.href, handleCodeInApp: true });
    window.localStorage.setItem("emailForSignIn", email);
  };

  const handleDemo = () => { setIsDemo(true); setProjects(DEMO_PROJECTS); setSelectedId(DEMO_PROJECTS[0].id); setView("dashboard"); };
  const handleLogout = () => { signOut(auth); setIsDemo(false); setProjects([]); setSelectedId(null); };

  const updateProject = async (projectId, data) => {
    const sequence = (saveSequence.current[projectId] || 0) + 1;
    saveSequence.current[projectId] = sequence;
    const lastUpdated = new Date().toISOString();
    setSaveStates(prev => ({ ...prev, [projectId]: { status: "saving" } }));
    try {
      if (!isDemo && !user) return false;
      if (!isDemo) await updateDoc(doc(db, "artifacts", appId, "users", user.uid, "projects", projectId), { ...data, lastUpdated });
      setProjects(prev => prev.map(p => p.id === projectId ? { ...p, ...data, lastUpdated } : p));
      if (saveSequence.current[projectId] === sequence) setSaveStates(prev => ({ ...prev, [projectId]: { status: "saved" } }));
      return true;
    } catch (e) {
      if (saveSequence.current[projectId] === sequence) setSaveStates(prev => ({ ...prev, [projectId]: { status: "error", retry: () => updateProject(projectId, data) } }));
      return false;
    }
  };

  const createProject = async (data) => {
    if (isDemo) { const project = { id: generateId(), status: "active", lastUpdated: new Date().toISOString(), whereIAm: "", dontForget: "", dontForgetMode: "checklist", dontForgetItems: [], icon: "", notes: [], resources: [], ...data }; setProjects(prev => [...prev, project]); setSelectedId(project.id); setView("project"); notifySuccess("Project added successfully."); return true; }
    if (!user) return false;
    try {
      const ref = await addDoc(collection(db, "artifacts", appId, "users", user.uid, "projects"), {
        status: "active", lastUpdated: new Date().toISOString(),
        whereIAm: "", dontForget: "", dontForgetMode: "text", dontForgetItems: [],
        icon: "", notes: [], resources: [], ...data,
      });
      setSelectedId(ref.id); setView("project"); notifySuccess("Project added successfully."); return true;
    } catch (e) { setProjectError("Could not create project. Please try again."); return false; }
  };

  const deleteProject = async (id) => {
    if (!user || isDemo) return false;
    try { await deleteDoc(doc(db, "artifacts", appId, "users", user.uid, "projects", id)); if (selectedId === id) setSelectedId(null); return true; }
    catch (e) { return false; }
  };

  const selectedProject = projects.find(p => p.id === selectedId);
  const matchesSearch = p => `${p.title} ${p.client || ""}`.toLowerCase().includes(projectSearch.toLowerCase());
  const activeProjects = projects.filter(p => p.status === "active" && matchesSearch(p));
  const pausedProjects = projects.filter(p => p.status === "paused" && matchesSearch(p));
  const completedProjects = projects.filter(p => p.status === "completed" && matchesSearch(p));
  const allProjects = [...activeProjects, ...pausedProjects, ...completedProjects];

  const updateCtx = (field, value) => selectedId ? updateProject(selectedId, { [field]: value }) : Promise.resolve(false);
  const handleBriefingUpdate = (fields) => selectedId ? updateProject(selectedId, fields) : Promise.resolve(false);
  const toggleStatus = (id) => { const p = projects.find(x => x.id === id); if (p && !isDemo) updateProject(id, { status: p.status === "active" ? "paused" : "active" }); };
  const markCompleted = (id) => { if (!isDemo) updateProject(id, { status: "completed" }); };
  const reopenProject = (id) => { if (!isDemo) updateProject(id, { status: "active" }); };

  const handleSaveResource = async (data) => {
    if (!selectedProject || (!isDemo && !user)) return false;
    const projectId = selectedProject.id;
    const existing = (selectedProject.resources || []).find(resource => resource.id === data.id);
    const { id: ignored, ...fields } = data;
    const resource = { ...existing, ...fields, ...(!data.id ? { createdAt: Date.now() } : {}), id: data.id || generateId(), preview: existing?.url === data.url ? existing.preview || null : null };
    const resources = data.id ? selectedProject.resources.map(item => item.id === data.id ? resource : item) : [resource, ...(selectedProject.resources || [])];
    const saved = await updateProject(projectId, { resources });
    if (!saved) return false;
    if (!data.id) notifySuccess("Resource added successfully.");
    if (!isDemo && user && !resource.preview && ["link", "document"].includes(resource.type)) {
      fetchOGPreview(resource.url).then(async preview => {
        if (!preview) return;
        try {
          await runTransaction(db, async transaction => {
            const ref = doc(db, "artifacts", appId, "users", user.uid, "projects", projectId);
            const snapshot = await transaction.get(ref);
            if (!snapshot.exists()) return;
            const current = snapshot.data().resources || [];
            if (!current.some(item => item.id === resource.id && item.url === resource.url)) return;
            transaction.update(ref, { resources: current.map(item => item.id === resource.id && item.url === resource.url ? { ...item, preview } : item) });
          });
        } catch { /* Preview enrichment is optional; the resource itself is saved. */ }
      });
    }
    return true;
  };

  const deleteRes = (id) => {
    if (!selectedProject) return;
    const updated = (selectedProject.resources || []).filter(r => r.id !== id);
    return updateProject(selectedProject.id, { resources: updated });
  };

  const handleScroll = e => setIsScrolled(e.target.scrollTop > 60);

  const selectProject = (id) => {
    setSelectedId(id); setIsScrolled(false); setView("project"); setActiveTab("overview");
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  const focusTask = async (projectId, taskId = "") => {
    if (["running", "paused"].includes(workspace.timer?.status) && !window.confirm("End your current focus session and focus on this task? The unfinished session will not be counted.")) return;
    if (await workspace.timerChange(newTimer("focus", projectId, taskId))) setFocusOpenRequest(value => value + 1);
  };
  const addTask = projectId => setTaskEditor({ projectId });
  const openDashboard = () => { setIsScrolled(false); setView("dashboard"); if (window.innerWidth < 768) setSidebarOpen(false); };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-[var(--app-bg)]">
      <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
    </div>
  );

  if (!user && !isDemo) return (
    <LoginScreen onGoogleLogin={handleGoogleLogin} onEmailAuth={handleEmailAuth} onMagicLink={handleMagicLink} onDemo={handleDemo} loading={loading} error={authError} />
  );

  const SidebarItemFull = ({ project }) => (
    <button type="button" onClick={() => selectProject(project.id)} aria-current={view === "project" && (view === "project" && selectedId === project.id) ? "page" : undefined}
      className={`project-nav-item group flex items-center gap-3 px-4 py-2.5 rounded-xl cursor-pointer transition-all duration-200 ease-apple mb-1 mr-4 min-h-[44px] ${(view === "project" && selectedId === project.id) ? "bg-indigo-50 text-indigo-900 font-semibold" : "hover:bg-slate-100 text-slate-600 hover:text-slate-900"}`}>
      {project.icon ? (
        <ProjectIcon icon={project.icon} size="sm" className="shrink-0" />
      ) : (
        <div className={`w-2.5 h-2.5 rounded-full shrink-0 transition-transform duration-300 ease-apple group-hover:scale-110 ${(view === "project" && selectedId === project.id) ? "bg-indigo-500" : project.status === "active" ? "bg-slate-300" : project.status === "completed" ? "bg-emerald-300" : "bg-amber-200"}`} />
      )}
      <span className="text-sm font-medium truncate">{project.title}</span>
      {view === "project" && selectedId === project.id && <span className="nav-selected-dot" />}
    </button>
  );

  // FIX 3: Removed className="!bg-transparent" which was overriding the icon's background colour
  const SidebarItemIcon = ({ project }) => (
    <button type="button" aria-label={project.title} onClick={() => selectProject(project.id)} title={project.title}
      className={`rail-project flex items-center justify-center w-10 h-10 rounded-xl cursor-pointer transition-all duration-200 ease-apple mb-1 mx-auto ${(view === "project" && selectedId === project.id) ? "bg-indigo-50 ring-2 ring-indigo-200" : "hover:bg-slate-100"}`}>
      {project.icon ? (
        <ProjectIcon icon={project.icon} size="sm" />
      ) : (
        <div className={`w-3 h-3 rounded-full transition-transform duration-300 ease-apple hover:scale-125 ${(view === "project" && selectedId === project.id) ? "bg-indigo-500" : project.status === "active" ? "bg-slate-400" : project.status === "completed" ? "bg-emerald-400" : "bg-amber-300"}`} />
      )}
    </button>
  );

  // FIX 1: Section labels changed to grey (text-slate-400)
  const SidebarContent = ({ onClose }) => (
    <>
      <div className="sidebar-heading p-6 pb-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3 text-slate-800 font-extrabold text-xl tracking-tight">
            <div className="p-2.5 bg-indigo-600 rounded-2xl text-slate-50 shadow-lg shadow-indigo-200/50 shrink-0">
              <ContinuumLogo className="w-5 h-5 text-white" />
            </div>
            <span>Continuum</span>
          </div>
          <button aria-label="Close projects sidebar" onClick={onClose}
            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors ease-apple active:scale-95">
            <PanelLeft className="w-5 h-5" />
          </button>
        </div>
        {!isDemo && (
          <button onClick={() => { setEditingProject(null); setIsProjectModalOpen(true); if (window.innerWidth < 768) setSidebarOpen(false); }}
            className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-100 py-3.5 rounded-2xl flex items-center justify-center gap-2 font-bold transition-all duration-200 ease-apple active:scale-95">
            <Plus className="w-5 h-5" /> New Project
          </button>
        )}
      </div>
      <button aria-current={view === "dashboard" ? "page" : undefined} className={`workspace-home ${view === "dashboard" ? "selected" : ""}`} onClick={openDashboard}><LayoutDashboard size={20} /> Workspace overview</button>
      <div className="sidebar-search"><Search size={16} /><input aria-label="Search projects" placeholder="Find a project…" value={projectSearch} onChange={e => setProjectSearch(e.target.value)} />{projectSearch && <button aria-label="Clear search" onClick={() => setProjectSearch("")}><X size={14} /></button>}</div>
      <div className="flex-1 overflow-y-auto px-2">
        {projectSearch && !projects.some(matchesSearch) && <p className="px-4 pb-5 text-xs text-slate-500">No projects match “{projectSearch}”.</p>}
        <div className="mb-8">
          <h3 className="t-eyebrow text-slate-400 mb-3 px-4">Active <span>{activeProjects.length}</span></h3>
          {activeProjects.map(p => <SidebarItemFull key={p.id} project={p} />)}
        </div>
        <div className="mb-8">
          <h3 className="t-eyebrow text-slate-400 mb-3 px-4">On hold <span>{pausedProjects.length}</span></h3>
          {pausedProjects.map(p => <SidebarItemFull key={p.id} project={p} />)}
        </div>
        <div className="mb-8">
          <button onClick={() => setIsCompletedExpanded(!isCompletedExpanded)}
            className="t-eyebrow text-slate-400 flex items-center justify-between w-full mb-3 px-4 hover:text-slate-600 transition-colors">
            Completed {isCompletedExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
          {isCompletedExpanded && completedProjects.map(p => <SidebarItemFull key={p.id} project={p} />)}
        </div>
      </div>
      <div className="p-4 border-t border-slate-200">
        <div className="account-summary"><span>{(user?.displayName || user?.email || "Demo").slice(0, 1).toUpperCase()}</span><div><strong>{user?.displayName || "Personal workspace"}</strong><p>{isDemo ? "You're exploring Continuum" : user?.email}</p></div></div>
        <button onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 text-sm font-semibold text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all ease-apple active:scale-95">
          <LogOut className="w-4 h-4" /> {isDemo ? "Exit demo" : "Sign Out"}
        </button>
      </div>
    </>
  );

  return (
    <>
      <div className="workspace-shell material-workspace flex flex-col h-screen text-slate-900 overflow-hidden bg-[var(--app-bg)]">
        {isDemo && <DemoBanner onSignIn={() => { setIsDemo(false); setProjects([]); setSelectedId(null); }} />}
        <div className="flex flex-1 overflow-hidden relative">
          {isSidebarOpen && (
            <div className="fixed inset-0 bg-slate-900/40 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
          )}
          <div className={`workspace-sidebar hidden md:flex flex-col flex-shrink-0 bg-slate-50 border-r border-slate-200/80 shadow-sm transition-all duration-500 ease-apple overflow-hidden ${isSidebarOpen ? "w-72" : "w-16"}`}>
            {isSidebarOpen ? (
              SidebarContent({ onClose: () => setSidebarOpen(false) })
            ) : (
              <div className="flex flex-col items-center py-5 h-full">
                <button onClick={() => setSidebarOpen(true)}
                  className="p-2.5 mb-5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors ease-apple active:scale-95" title="Expand sidebar">
                  <PanelRight className="w-5 h-5" />
                </button>
                <button aria-current={view === "dashboard" ? "page" : undefined} onClick={openDashboard} aria-label="Workspace overview" className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center mb-5 shrink-0">
                  <LayoutDashboard size={23} />
                </button>
                <span className="rail-label">Overview</span>
                {!isDemo && (
                  <button onClick={() => { setEditingProject(null); setIsProjectModalOpen(true); }}
                    className="w-10 h-10 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-5 transition-all ease-apple active:scale-95" title="New Project">
                    <Plus className="w-5 h-5" />
                  </button>
                )}
                <span className="rail-section-label">Projects</span>
                <div className="flex-1 overflow-y-auto w-full px-1">
                  {allProjects.map(p => <SidebarItemIcon key={p.id} project={p} />)}
                </div>
                <div className="pb-4">
                  <button onClick={handleLogout}
                    className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all ease-apple active:scale-95" title={isDemo ? "Exit demo" : "Sign Out"}>
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
          <div ref={drawerRef} role="dialog" aria-label="Projects navigation" aria-modal={isSidebarOpen ? true : undefined} aria-hidden={!isSidebarOpen} inert={isSidebarOpen ? undefined : ""} className={`fixed md:hidden top-0 left-0 h-full z-50 w-80 bg-slate-50 flex flex-col shadow-2xl transition-transform duration-500 ease-apple ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
            {SidebarContent({ onClose: () => setSidebarOpen(false) })}
          </div>

          <div className="workspace-center flex-1 flex flex-col h-full overflow-hidden relative min-w-0">
            {view === "project" && <div className={`absolute top-0 left-0 right-0 bg-[var(--app-bg)]/90 backdrop-blur-xl z-30 border-b border-slate-200/50 transition-all duration-500 ease-apple transform ${isScrolled ? "translate-y-0 opacity-100 shadow-sm" : "-translate-y-full opacity-0 pointer-events-none"}`}>
              <div className="max-w-6xl mx-auto px-6 md:px-12 py-3 flex items-center gap-3">
                <button onClick={() => setSidebarOpen(true)}
                  className="md:hidden p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors shrink-0">
                  <Menu className="w-5 h-5" />
                </button>
                <h2 className="text-lg font-bold text-slate-900 truncate flex-1 tracking-tight">{selectedProject?.title}</h2>
                {!isDemo && selectedProject && (
                  <div className="flex items-center gap-2 shrink-0">
                    {selectedProject.status !== "completed" ? (
                      <>
                        <Button onClick={() => toggleStatus(selectedProject.id)} variant="secondary" className="h-9 px-4 text-xs font-semibold">
                          {selectedProject.status === "active" ? <><PauseCircle className="w-3.5 h-3.5" /> Pause</> : <><PlayCircle className="w-3.5 h-3.5" /> Resume</>}
                        </Button>
                        <Button variant="secondary" onClick={() => markCompleted(selectedProject.id)} className="h-9 px-4 text-xs font-semibold">
                          <CheckSquare className="w-3.5 h-3.5" /> Done
                        </Button>
                      </>
                    ) : (
                      <Button variant="primary" onClick={() => reopenProject(selectedProject.id)} className="h-9 px-4 text-xs font-semibold">
                        <RotateCcw className="w-3.5 h-3.5" /> Reopen
                      </Button>
                    )}
                    <Button variant="icon" onClick={() => { setEditingProject(selectedProject); setIsProjectModalOpen(true); }} className="h-9 w-9">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            }
            <div className="workspace-mobile-topbar"><span>Continuum</span><span>{view === "dashboard" ? "Workspace" : "Project"}</span></div>
            <nav className="workspace-mobile-nav" aria-label="Main navigation">
              <button aria-current={view === "dashboard" ? "page" : undefined} onClick={openDashboard}><LayoutDashboard size={22} /><span>Overview</span></button>
              <button aria-current={view === "project" ? "page" : undefined} aria-expanded={isSidebarOpen} onClick={() => setSidebarOpen(true)}><Folder size={22} /><span>Projects</span></button>
              <button onClick={() => setFocusOpenRequest(value => value + 1)}><Target size={22} /><span>Focus</span></button>
            </nav>
            {(workspace.error || projectError) && <div role="alert" className="workspace-error">{workspace.error || projectError}</div>}
            {view === "dashboard" ? (<div key="dashboard" className="workspace-scroll">{workspace.loading || projectLoading ? <div className="ws-empty">Loading your workspace…</div> : <Dashboard projects={projects} workspace={workspace} onOpen={selectProject} onAdd={addTask} onNewProject={() => { setEditingProject(null); setIsProjectModalOpen(true); }} onEdit={task => setTaskEditor({ task })} onFocus={focusTask} />}</div>) : selectedProject ? (
              <div key={selectedProject.id} className={`project-scroll flex-1 overflow-y-auto pb-12 scroll-smooth ${activeTab === "resources" ? "resources-mode" : ""}`} onScroll={handleScroll}>
                <div className="mobile-project-banner flex items-center gap-3 px-4 pt-5 pb-2 md:hidden">
                  <button onClick={() => setSidebarOpen(true)}
                    className="p-2.5 bg-slate-50 text-slate-500 hover:text-indigo-600 rounded-full transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center shadow-sm border border-slate-200">
                    <Menu className="w-5 h-5" />
                  </button>
                  <p className="text-sm font-semibold text-slate-500 truncate">{selectedProject.title}</p>
                </div>
                <div className="project-content w-full max-w-6xl mx-auto px-6 md:px-12 pt-10 md:pt-16 pb-12">
                  <div className="project-heading mb-6">
                    <div className="context-save-status" role="status"><span>{saveStates[selectedProject.id]?.status === "editing" ? "Unsaved changes…" : saveStates[selectedProject.id]?.status === "saving" ? "Saving…" : saveStates[selectedProject.id]?.status === "error" ? "Could not save your changes." : "Saved"}</span>{saveStates[selectedProject.id]?.status === "error" && <button onClick={saveStates[selectedProject.id].retry}>Retry save</button>}<span>Updated {selectedProject.lastUpdated ? new Date(selectedProject.lastUpdated).toLocaleString() : "not yet"}</span></div>
                    <div className="project-breadcrumb"><span>Workspace</span><span>/</span><span>{selectedProject.client || "Projects"}</span></div>
                    <div className="project-title-row flex items-start gap-4 mb-8">
                      {selectedProject.icon && <ProjectIcon icon={selectedProject.icon} size="lg" className="mt-1 shrink-0" />}
                      <h1 className="project-title text-5xl font-semibold tracking-tight text-slate-900 break-words leading-[1.1]">
                        {selectedProject.title}
                      </h1>
                      <span className="project-header-controls"><Select className={`project-status-select ${selectedProject.status}`} aria-label="Project status" value={selectedProject.status || 'active'} disabled={saveStates[selectedProject.id]?.status === 'saving'} onChange={e => updateProject(selectedProject.id, { status: e.target.value })}><option value="active">Active</option><option value="paused">On hold</option><option value="completed">Completed</option></Select><button className="ds-icon-button" aria-label="Edit project" onClick={() => { setEditingProject(selectedProject); setIsProjectModalOpen(true); }}><Settings size={20} /></button></span>
                    </div>
                    <div className="project-metadata grid grid-cols-1 lg:grid-cols-12 gap-5 border-t border-slate-200/60 pt-8">
                      <div className="md:col-span-3 space-y-3">
                        <p className="t-eyebrow text-slate-500">Start date</p>
                        <div className="flex items-center gap-2 text-slate-700 font-medium text-base">
                         <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                          {selectedProject.startDate ? new Date(`${selectedProject.startDate}T00:00:00`).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) : "N/A"}
                        </div>
                      </div>
                      <div className="md:col-span-9 space-y-3">
                        <p className="t-eyebrow text-slate-500">Description</p>
                        <p className="text-base text-slate-600 leading-relaxed">{selectedProject.description || "No description provided."}</p>
                      </div>
                    </div>
                  </div>
                  <div className="project-snapshot">
                    <div><span className="snapshot-icon"><Clock size={18} /></span><div><strong>Pick up where you left off</strong><p>Your project context, always within reach.</p></div></div>
                    <button onClick={() => { setActiveTab("overview"); requestAnimationFrame(() => document.getElementById("project-questions")?.scrollIntoView({ behavior: "smooth", block: "center" })); }}><strong>{(selectedProject.notes || []).filter(n => !n.isResolved).length}</strong><span>open questions</span><ArrowUpRight size={16} /></button>
                  </div>
                  <div className="mt-3">
                    <div className="project-tabs" role="tablist" aria-label="Project sections" onKeyDown={e => {
                      const ids = ["overview", "tasks", "resources"], index = ids.indexOf(activeTab);
                      if (["ArrowRight", "ArrowLeft", "Home", "End"].includes(e.key)) { e.preventDefault(); const next = e.key === "Home" ? 0 : e.key === "End" ? 2 : (index + (e.key === "ArrowRight" ? 1 : 2)) % 3; setActiveTab(ids[next]); e.currentTarget.querySelectorAll("button")[next]?.focus(); }
                    }}>
                      {[["overview", "Overview"], ["tasks", "Tasks"], ["resources", "Resources"]].map(([id, label]) => <button role="tab" tabIndex={activeTab === id ? 0 : -1} aria-selected={activeTab === id} className={activeTab === id ? "text-indigo-900" : "text-slate-500"} key={id} onClick={() => setActiveTab(id)}>{label}<span className="tab-count">{id === "tasks" ? workspace.tasks.filter(t => t.projectId === selectedProject.id && !t.completed).length : id === "resources" ? selectedProject.resources.length : ""}</span></button>)}
                    </div>
                    <div className="min-h-[400px]">
                      <div key={activeTab} className="animate-in fade-in duration-500 ease-apple">
                        {activeTab === "overview" ? (
                          <OverviewTab key={selectedProject.id} project={selectedProject} onUpdate={fields => updateProject(selectedProject.id, fields)} onDirty={() => setSaveStates(prev => ({ ...prev, [selectedProject.id]: { status: "editing" } }))} onUpdateCtx={updateCtx} isDemo={isDemo} />
                        ) : activeTab === "tasks" ? (
                          <NextSteps key={selectedProject.id} project={selectedProject} projects={projects} workspace={workspace} onEdit={task => setTaskEditor({ task })} onAdd={addTask} onFocus={focusTask} />
                        ) : (
                          <ResourceLibrary key={selectedProject.id} resources={selectedProject.resources || []} isDemo={isDemo}
                            onAdd={() => { setEditingResource(null); setIsResourceModalOpen(true); }}
                            onEdit={resource => { setEditingResource(resource); setIsResourceModalOpen(true); }}
                            onDelete={deleteRes} />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400 animate-in fade-in zoom-in-95 duration-500 ease-apple px-6">
                <div className="w-32 h-32 bg-slate-100 rounded-full flex items-center justify-center mb-8 shadow-inner">
                  <Folder className="w-16 h-16 text-slate-300" />
                </div>
                <p className="text-xl font-bold text-slate-900 mb-2">Ready to work?</p>
                <p className="text-slate-500 mb-8 text-center">Select a project from the sidebar to begin</p>
                <button onClick={() => setSidebarOpen(true)} className="md:hidden mb-4 flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
                  <Menu className="w-4 h-4" /> Open projects
                </button>
                {!isDemo && (
                  <Button className="pl-6 pr-8 py-3.5 text-base shadow-lg shadow-indigo-200" onClick={() => { setEditingProject(null); setIsProjectModalOpen(true); }}>
                    <Plus className="w-5 h-5" /> Create First Project
                  </Button>
                )}
              </div>
            )}

            {isResourceModalOpen && <ResourceModal isOpen={isResourceModalOpen} onClose={() => setIsResourceModalOpen(false)} onSubmit={handleSaveResource} resource={editingResource} />}
            {isProjectModalOpen && (
              <ProjectModal isOpen={isProjectModalOpen} onClose={() => setIsProjectModalOpen(false)} project={editingProject}
                onSubmit={data => editingProject ? updateProject(editingProject.id, data) : createProject(data)}
                onDelete={deleteProject} />
            )}
          </div>
          <FocusPanel projects={projects} workspace={workspace} isDemo={isDemo} openRequest={focusOpenRequest} />
        </div>
        {successMessage && <div className="success-snackbar" role="status" key={successMessage.id}><CheckCircle2 size={20} /><span>{successMessage.text}</span><button className="ds-icon-button" aria-label="Dismiss success message" onClick={() => setSuccessMessage(null)}><X size={18} /></button></div>}
        {taskEditor && <TaskEditor projects={projects} {...taskEditor} busy={workspace.busy} error={workspace.error} onSave={workspace.saveTask} onClose={() => setTaskEditor(null)} />}
      </div>
    </>
  );
}
