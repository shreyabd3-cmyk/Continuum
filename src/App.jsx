import React, { useState, useEffect, useRef } from "react";
import {
  Folder, PauseCircle, PlayCircle, Plus, MoreVertical,
  Link as LinkIcon, Image as ImageIcon, ExternalLink, Trash2,
  X, CheckCircle2, Circle, ChevronDown, ChevronUp, Edit2,
  File as FileIcon, Calendar, Settings, PanelLeft, PanelRight,
  LogOut, Loader2, AlertCircle,
  CheckSquare, RotateCcw, List, MessageCircle, Mail, ArrowLeft,
  Send, Menu, Smile, Upload, Clock, AlertTriangle,
} from "lucide-react";

import { initializeApp } from "firebase/app";
import {
  getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged,
  signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword,
  sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink,
  fetchSignInMethodsForEmail, sendPasswordResetEmail,
} from "firebase/auth";
import {
  getFirestore, collection, addDoc, updateDoc, deleteDoc,
  doc, onSnapshot, query,
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
    startDate: "2026-02-10", icon: "🏥",
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
    startDate: "2026-01-15", icon: "⚡",
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
    <button className={`${base} ${variant !== "icon" ? styles[variant] : ""} ${className}`} {...props}>
      {children}
    </button>
  );
};

const Input = ({ className = "", ...props }) => (
  <input className={`w-full bg-slate-100 hover:bg-slate-200/60 focus:bg-slate-50 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 border border-slate-200 transition-all duration-200 ease-apple placeholder:text-slate-400 ${className}`} {...props} />
);

const TextArea = ({ className = "", ...props }) => (
  <textarea className={`w-full bg-slate-100 hover:bg-slate-200/60 focus:bg-slate-50 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 border border-slate-200 transition-all duration-200 ease-apple placeholder:text-slate-400 resize-none ${className}`} {...props} />
);

const Badge = ({ children, color = "slate", className = "" }) => {
  const colors = {
    slate: "bg-slate-100 text-slate-700 border-slate-200",
    green: "bg-emerald-50 text-emerald-700 border-emerald-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    indigo: "bg-indigo-50 text-indigo-700 border-indigo-200",
  };
  return <span className={`px-3 py-1 rounded-lg text-xs font-medium border ${colors[color]} ${className}`}>{children}</span>;
};

const ICON_COLORS = [
  { hex: "#6366f1", label: "Indigo" },
  { hex: "#10b981", label: "Emerald" },
  { hex: "#f59e0b", label: "Amber" },
  { hex: "#3b82f6", label: "Blue" },
  { hex: "#ec4899", label: "Pink" },
  { hex: "#ef4444", label: "Red" },
  { hex: "#8b5cf6", label: "Violet" },
  { hex: "#14b8a6", label: "Teal" },
  { hex: "#f97316", label: "Orange" },
  { hex: "#64748b", label: "Slate" },
];

const parseIcon = (icon) => {
  if (!icon) return { text: "", color: ICON_COLORS[0].hex, isImage: false };
  if (icon.startsWith("data:")) return { text: "", color: "", isImage: true };
  const parts = icon.split("|");
  return { text: parts[0] || "", color: parts[1] || ICON_COLORS[0].hex, isImage: false };
};

const ProjectIcon = ({ icon, size = "sm", className = "" }) => {
  const sizes = { sm: "w-7 h-7", md: "w-10 h-10", lg: "w-14 h-14" };
  const fontSizes = { sm: 11, md: 14, lg: 20 };
  if (!icon) return null;
  const { text, color, isImage } = parseIcon(icon);
  return (
    <div className={`${sizes[size]} rounded-xl flex items-center justify-center shrink-0 ${className}`}
      style={{ backgroundColor: isImage ? "#f1f5f9" : color }}>
      {isImage
        ? <img src={icon} alt="project icon" className="w-full h-full object-cover rounded-xl" />
        : <span style={{ fontSize: fontSizes[size], fontWeight: 800, color: "white", letterSpacing: "0.03em", lineHeight: 1 }}>{text.toUpperCase()}</span>}
    </div>
  );
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
              <button key={hex} type="button" title={label} onClick={() => handleColorSelect(hex)}
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
    <div className="md:flex md:flex-row md:h-screen md:overflow-hidden bg-white min-h-screen w-full">
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
               <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Get started</h1>
                <p className="text-sm text-slate-500 leading-relaxed mb-8">New here? We'll create your account automatically.</p>
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
                <Input type="email" placeholder="Your email address" value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") handleEmailSubmit(); }}
                  className="mb-3" />
                {authMode === "password" && (
                  <div className="mb-1">
                    <Input type="password" placeholder="Password" value={password}
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
  <div className="bg-indigo-600 text-slate-50 px-6 py-2.5 flex items-center justify-between shrink-0 z-30 gap-3">
    <p className="text-xs font-semibold">Exploring demo data — nothing is saved.</p>
    <button onClick={onSignIn} className="text-xs font-bold bg-slate-50 text-indigo-700 px-4 py-1.5 rounded-full hover:bg-indigo-50 transition-colors active:scale-95 ease-apple shrink-0">
      Sign in to save your work
    </button>
  </div>
);

// FIX 2: Resource Type selector removed. Existing resources keep their type.
// New resources default to "link". No data is lost.
const ResourceModal = ({ isOpen, onClose, onSubmit, resource = null }) => {
  const [selectedTags, setSelectedTags] = useState(resource?.tags || []);
  const [customTag, setCustomTag] = useState("");

  useEffect(() => {
    setSelectedTags(resource?.tags || []);
    setCustomTag("");
  }, [resource, isOpen]);

  if (!isOpen) return null;

  const toggleTag = (tag) => setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  const handleAddCustomTag = (e) => {
    e.preventDefault();
    if (customTag.trim() && !selectedTags.includes(customTag.trim())) { setSelectedTags(prev => [...prev, customTag.trim()]); setCustomTag(""); }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    // Preserve existing type when editing, default to "link" for new
    const type = resource?.type || "link";
    onSubmit({ id: resource?.id || null, type, title: fd.get("title"), url: fd.get("url"), description: fd.get("description"), tags: selectedTags });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in" onClick={onClose}>
      <div className="bg-slate-50 w-full sm:max-w-lg sm:rounded-[28px] rounded-t-[28px] shadow-2xl overflow-hidden animate-in slide-in-from-bottom sm:zoom-in-95 duration-300 ease-apple flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-slate-200 flex justify-between items-center shrink-0">
          <h3 className="font-bold text-xl text-slate-900">{resource ? "Edit Resource" : "Add New Resource"}</h3>
          <Button variant="icon" onClick={onClose}><X className="w-5 h-5" /></Button>
        </div>
        <div className="p-8 overflow-y-auto">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-500 ml-1">Title</label>
                <Input name="title" defaultValue={resource?.title || ""} autoFocus placeholder="e.g., Competitor Analysis" required />
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-500 ml-1">URL</label>
                <Input name="url" defaultValue={resource?.url || ""} type="url" placeholder="https://..." required />
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-500 ml-1">Description</label>
                <TextArea name="description" defaultValue={resource?.description || ""} rows="3" placeholder="Add a brief description..." />
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-500 ml-1">Tags</label>
                <div className="flex gap-2 mb-3">
                  <Input value={customTag} onChange={e => setCustomTag(e.target.value)} placeholder="Add custom tag..."
                    onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); handleAddCustomTag(e); } }} className="py-2" />
                  <Button type="button" variant="secondary" onClick={handleAddCustomTag} className="px-4 shrink-0">Add</Button>
                </div>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-1">
                  {selectedTags.map(tag => (
                    <button key={tag} type="button" onClick={() => toggleTag(tag)}
                      className="px-4 py-1.5 rounded-lg text-xs font-medium border transition-all ease-apple bg-indigo-50 border-indigo-200 text-indigo-700 active:scale-95">
                      {tag} <X className="w-3 h-3 inline ml-1" />
                    </button>
                  ))}
                  {DEFAULT_TAGS.filter(t => !selectedTags.includes(t)).map(tag => (
                    <button key={tag} type="button" onClick={() => toggleTag(tag)}
                      className="px-4 py-1.5 rounded-lg text-xs font-medium border transition-all ease-apple bg-slate-100 border-slate-200 text-slate-500 hover:bg-slate-200 active:scale-95">
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-8 pt-4">
                <Button type="button" variant="tertiary" onClick={onClose}>Cancel</Button>
                <Button type="submit" variant="primary" className="px-8">{resource ? "Save Changes" : "Add Resource"}</Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const ProjectModal = ({ isOpen, onClose, project, onSubmit, onDelete }) => {
  const [icon, setIcon] = useState(project?.icon || "");
  useEffect(() => { setIcon(project?.icon || ""); }, [project?.id, isOpen]);
  if (!isOpen) return null;
  const isEditing = !!project;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in" onClick={onClose}>
      <div className="bg-slate-50 w-full sm:max-w-lg sm:rounded-[28px] rounded-t-[28px] shadow-2xl overflow-hidden animate-in slide-in-from-bottom sm:zoom-in-95 duration-300 ease-apple max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
          <h3 className="font-bold text-xl text-slate-900">{isEditing ? "Edit Project" : "Create New Project"}</h3>
          <Button variant="icon" onClick={onClose}><X className="w-5 h-5" /></Button>
        </div>
        <div className="p-8">
          <form onSubmit={e => {
            e.preventDefault();
            const fd = new FormData(e.target);
            onSubmit({ title: fd.get("title"), client: fd.get("client"), startDate: fd.get("startDate"), description: fd.get("description"), icon });
            onClose();
          }}>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-500 ml-1">Project Icon <span className="text-slate-400 font-normal">(optional)</span></label>
                <div className="flex items-center gap-4 mb-3">
                  {icon ? <ProjectIcon icon={icon} size="md" /> : (
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                      <span style={{ fontSize: 11, fontWeight: 700, color: "#6366f1" }}>AB</span>
                    </div>
                  )}
                  <span className="text-xs text-slate-400">Add a short name or upload an image to identify this project in the sidebar</span>
                </div>
                <IconPicker value={icon} onChange={setIcon} />
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-500 ml-1">Project Name</label>
                <Input name="title" defaultValue={project?.title || ""} autoFocus placeholder="e.g., Nebula Brand Identity" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-slate-500 ml-1">Client Name</label>
                  <Input name="client" defaultValue={project?.client || ""} placeholder="e.g., Nebula Tech" required />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-slate-500 ml-1">Start Date</label>
                  <Input name="startDate" type="date" defaultValue={project?.startDate || ""} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-500 ml-1">Description</label>
                <TextArea name="description" defaultValue={project?.description || ""} rows="4" placeholder="Brief summary of the project goals..." />
              </div>
              <div className="flex justify-between items-center mt-8 pt-4">
                {isEditing ? (
                  <Button type="button" variant="destructive" onClick={() => { if (confirm("Delete this project?")) { onDelete(project.id); onClose(); } }}>Delete Project</Button>
                ) : <div />}
                <div className="flex gap-3">
                  <Button type="button" variant="tertiary" onClick={onClose}>Cancel</Button>
                  <Button type="submit" variant="primary" className="px-8">{isEditing ? "Save Changes" : "Create Project"}</Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const WhereIAmCard = ({ project, onUpdate, isDemo }) => {
  const [local, setLocal] = useState(project?.whereIAm || "");
  const textareaRef = useRef(null);
  useEffect(() => { setLocal(project?.whereIAm || ""); }, [project?.id]);
  useEffect(() => {
    if (textareaRef.current) { textareaRef.current.style.height = "auto"; textareaRef.current.style.height = textareaRef.current.scrollHeight + "px"; }
  }, [local]);
  useEffect(() => {
    if (!project || isDemo) return;
    const t = setTimeout(() => { if (local !== (project.whereIAm || "")) onUpdate({ whereIAm: local }); }, 1000);
    return () => clearTimeout(t);
  }, [local]);

  return (
    <div className="bg-slate-50 rounded-[24px] shadow-sm border border-slate-200 p-8 shadow-md shadow-slate-200/50">
    <div className="flex items-center gap-2.5 mb-4 flex-wrap">
        <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
          <Clock className="w-3.5 h-3.5 text-indigo-500" />
        </div>
        <span className="t-eyebrow text-indigo-600">Where I am</span>
      </div>
      <textarea ref={textareaRef}
        className="w-full bg-transparent focus:outline-none text-slate-700 leading-relaxed resize-none placeholder:text-slate-300 text-sm font-light min-h-[80px]"
        placeholder="Current phase, what just happened, where things stand..."
        value={local} onChange={e => setLocal(e.target.value)} readOnly={isDemo} />
    </div>
  );
};

const DontForgetCard = ({ project, onUpdate, isDemo }) => {
  const [mode, setMode] = useState(project?.dontForgetMode || "text");
  const [localText, setLocalText] = useState(project?.dontForget || "");
  const [items, setItems] = useState(project?.dontForgetItems || []);
  const [newItem, setNewItem] = useState("");
  const textareaRef = useRef(null);

  useEffect(() => {
    setMode(project?.dontForgetMode || "text");
    setLocalText(project?.dontForget || "");
    setItems(project?.dontForgetItems || []);
  }, [project?.id]);

  useEffect(() => {
    if (mode === "text" && textareaRef.current) { textareaRef.current.style.height = "auto"; textareaRef.current.style.height = textareaRef.current.scrollHeight + "px"; }
  }, [localText, mode]);

  useEffect(() => {
    if (!project || isDemo) return;
    const t = setTimeout(() => { if (localText !== (project.dontForget || "")) onUpdate({ dontForget: localText }); }, 1000);
    return () => clearTimeout(t);
  }, [localText]);

  const switchMode = () => {
    if (isDemo) return;
    const next = mode === "text" ? "checklist" : "text";
    setMode(next); onUpdate({ dontForgetMode: next });
  };
  const addItem = () => {
    if (!newItem.trim() || isDemo) return;
    const updated = [...items, { id: generateId(), text: newItem.trim(), checked: false }];
    setItems(updated); setNewItem(""); onUpdate({ dontForgetItems: updated });
  };
  const toggleItem = (id) => {
    if (isDemo) return;
    const updated = items.map(it => it.id === id ? { ...it, checked: !it.checked } : it);
    setItems(updated); onUpdate({ dontForgetItems: updated });
  };
  const deleteItem = (id) => {
    if (isDemo) return;
    const updated = items.filter(it => it.id !== id);
    setItems(updated); onUpdate({ dontForgetItems: updated });
  };

  return (
    <div className="bg-slate-50 rounded-[24px] shadow-sm border border-slate-200 p-8 shadow-md shadow-slate-200/50">
      <div className="flex items-center gap-2.5 mb-4 flex-wrap">
        <div className="w-7 h-7 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
        </div>
        <span className="t-eyebrow text-amber-600">Don't forget</span>
        {!isDemo && (
          <button onClick={switchMode}
            className="ml-auto flex items-center gap-1.5 text-[10px] font-bold text-slate-400 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 px-2.5 py-1 rounded-full transition-all ease-apple active:scale-95">
            {mode === "text" ? <><CheckSquare className="w-3 h-3" /> Checklist</> : <><List className="w-3 h-3" /> Text</>}
          </button>
        )}
      </div>
      {mode === "text" ? (
        <textarea ref={textareaRef}
          className="w-full bg-transparent focus:outline-none text-slate-700 leading-relaxed resize-none placeholder:text-slate-300 text-sm font-light min-h-[80px]"
          placeholder="Key constraints, decisions, things you'd forget after switching clients for a few days..."
          value={localText} onChange={e => setLocalText(e.target.value)} readOnly={isDemo} />
      ) : (
        <div className="space-y-2">
          {items.map(item => (
            <div key={item.id} className="flex items-center gap-3 group">
              <button onClick={() => toggleItem(item.id)}
                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ease-apple active:scale-95 ${item.checked ? "bg-indigo-500 border-indigo-500" : "border-slate-300 hover:border-indigo-400"}`}>
                {item.checked && <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>}
              </button>
              <span className={`text-sm flex-1 leading-relaxed ${item.checked ? "line-through text-slate-300" : "text-slate-700"}`}>{item.text}</span>
              {!isDemo && (
                <button onClick={() => deleteItem(item.id)} className="opacity-0 group-hover:opacity-100 p-1 text-slate-300 hover:text-red-400 transition-all ease-apple">
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
          {!isDemo && (
            <div className="flex items-center gap-3 mt-3 pt-2 border-t border-slate-200">
              <div className="w-5 h-5 rounded-md border-2 border-dashed border-slate-300 shrink-0" />
              <input className="text-sm text-slate-500 bg-transparent focus:outline-none placeholder:text-slate-300 flex-1"
                placeholder="Add item..." value={newItem} onChange={e => setNewItem(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") addItem(); }} />
              {newItem && <button onClick={addItem} className="text-[10px] font-bold text-indigo-500 hover:text-indigo-700 transition-colors px-2 py-1">Add</button>}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const OverviewTab = ({ project, onUpdate, onUpdateCtx, isDemo }) => {
  const [showHistory, setShowHistory] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState("");

  useEffect(() => {
    const handleClick = () => setActiveMenuId(null);
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  const addQuestion = (content) => {
    if (!content.trim() || isDemo) return;
    const newNote = { id: generateId(), type: "question", content, timestamp: new Date().toLocaleDateString(), isResolved: false };
    onUpdateCtx("notes", [newNote, ...(project.notes || [])]);
  };
  const deleteNote = (id) => { if (!isDemo) onUpdateCtx("notes", (project.notes || []).filter(n => n.id !== id)); };
  const toggleNoteRes = (id) => { if (!isDemo) onUpdateCtx("notes", (project.notes || []).map(n => n.id === id ? { ...n, isResolved: !n.isResolved } : n)); };
  const startEditing = (note, e) => {
    if (isDemo) return;
    e.stopPropagation(); setEditingId(note.id); setEditContent(note.content); setActiveMenuId(null);
  };
  const saveEdit = () => {
    if (editContent.trim()) onUpdateCtx("notes", (project.notes || []).map(n => n.id === editingId ? { ...n, content: editContent } : n));
    setEditingId(null);
  };

  const activeQuestions = (project.notes || []).filter(n => !n.isResolved && n.type === "question");
  const resolvedQuestions = (project.notes || []).filter(n => n.isResolved && n.type === "question");

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WhereIAmCard project={project} onUpdate={onUpdate} isDemo={isDemo} />
        <DontForgetCard project={project} onUpdate={onUpdate} isDemo={isDemo} />
      </div>
      <div className="bg-slate-50 rounded-[24px] shadow-sm border border-slate-200 p-8 shadow-md shadow-slate-200/50">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
            <MessageCircle className="w-4 h-4 text-amber-600" />
          </div>
          <span className="t-eyebrow text-amber-700">Questions</span>
        </div>
        {!isDemo && (
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
                    <button onClick={() => toggleNoteRes(note.id)}
                      className="w-10 h-10 rounded-full border-2 border-amber-100 text-amber-600 bg-amber-50 flex items-center justify-center hover:bg-amber-100 hover:scale-110 transition-all ease-apple">
                      <Circle className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-3">
                      <Badge color="amber">question</Badge>
                      <span className="text-xs font-semibold text-slate-400">{note.timestamp}</span>
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
                  {!isDemo && (
                    <div className="relative shrink-0">
                      <Button variant="icon" className="opacity-0 group-hover:opacity-100"
                        onClick={e => { e.stopPropagation(); setActiveMenuId(activeMenuId === note.id ? null : note.id); }}>
                        <MoreVertical className="w-5 h-5" />
                      </Button>
                      {activeMenuId === note.id && (
                        <div className="absolute right-0 top-10 w-48 bg-slate-50 rounded-2xl shadow-xl border border-slate-200 py-2 z-10 animate-in fade-in zoom-in-95 duration-200">
                          <button onClick={e => startEditing(note, e)} className="w-full text-left px-5 py-3 text-sm text-slate-600 hover:bg-slate-100 flex items-center gap-3 font-medium transition-colors">
                            <Edit2 className="w-4 h-4" /> Edit
                          </button>
                          <button onClick={e => { e.stopPropagation(); deleteNote(note.id); }} className="w-full text-left px-5 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 font-medium transition-colors">
                            <Trash2 className="w-4 h-4" /> Delete
                          </button>
                        </div>
                      )}
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
            Resolved Questions History {resolvedQuestions.length > 0 && `(${resolvedQuestions.length})`}
          </button>
          {showHistory && (
            <div className="space-y-4 pl-6 border-l-2 border-slate-200">
              {resolvedQuestions.length === 0 ? (
                <p className="text-sm text-slate-400 italic">No resolved questions yet.</p>
              ) : resolvedQuestions.map(note => (
                <div key={note.id} className="opacity-60 hover:opacity-100 transition-opacity flex items-center gap-3 bg-slate-100 p-5 rounded-2xl">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  <p className="text-sm text-slate-600 line-through decoration-slate-300 flex-1">{note.content}</p>
                  {!isDemo && <Button variant="tertiary" onClick={() => toggleNoteRes(note.id)} className="text-xs px-2 py-1 shrink-0">Undo</Button>}
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
  const [user, setUser] = useState(null);
  const [isDemo, setIsDemo] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [projects, setProjects] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isCompletedExpanded, setIsCompletedExpanded] = useState(false);
  const [resourceFilter, setResourceFilter] = useState(null);
  const [isResourceModalOpen, setIsResourceModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [editingResource, setEditingResource] = useState(null);

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
    const ref = collection(db, "artifacts", appId, "users", user.uid, "projects");
    const unsub = onSnapshot(query(ref), snapshot => {
      const loaded = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setProjects(loaded);
      if (loaded.length > 0) setSelectedId(prev => loaded.find(p => p.id === prev) ? prev : loaded[0].id);
    }, err => console.error(err));
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

  const handleDemo = () => { setIsDemo(true); setProjects(DEMO_PROJECTS); setSelectedId(DEMO_PROJECTS[0].id); };
  const handleLogout = () => { signOut(auth); setIsDemo(false); setProjects([]); setSelectedId(null); };

  const updateProject = async (projectId, data) => {
    if (!user || isDemo) return;
    try { await updateDoc(doc(db, "artifacts", appId, "users", user.uid, "projects", projectId), { ...data, lastUpdated: new Date().toISOString() }); }
    catch (e) { console.error(e); }
  };

  const createProject = async (data) => {
    if (!user || isDemo) return;
    try {
      const ref = await addDoc(collection(db, "artifacts", appId, "users", user.uid, "projects"), {
        status: "active", lastUpdated: new Date().toISOString(),
        whereIAm: "", dontForget: "", dontForgetMode: "text", dontForgetItems: [],
        icon: "", notes: [], resources: [], ...data,
      });
      setSelectedId(ref.id);
    } catch (e) { console.error(e); }
  };

  const deleteProject = async (id) => {
    if (!user || isDemo) return;
    try { await deleteDoc(doc(db, "artifacts", appId, "users", user.uid, "projects", id)); if (selectedId === id) setSelectedId(null); }
    catch (e) { console.error(e); }
  };

  const selectedProject = projects.find(p => p.id === selectedId);
  const activeProjects = projects.filter(p => p.status === "active");
  const pausedProjects = projects.filter(p => p.status === "paused");
  const completedProjects = projects.filter(p => p.status === "completed");
  const allProjects = [...activeProjects, ...pausedProjects, ...completedProjects];

  const updateCtx = (field, value) => { if (selectedId && !isDemo) updateProject(selectedId, { [field]: value }); };
  const handleBriefingUpdate = (fields) => { if (selectedId && !isDemo) updateProject(selectedId, fields); };
  const toggleStatus = (id) => { const p = projects.find(x => x.id === id); if (p && !isDemo) updateProject(id, { status: p.status === "active" ? "paused" : "active" }); };
  const markCompleted = (id) => { if (!isDemo) updateProject(id, { status: "completed" }); };
  const reopenProject = (id) => { if (!isDemo) updateProject(id, { status: "active" }); };

  // FIX 4: Optimistic resource add — card appears immediately, OG preview loads in background
  const handleSaveResource = (data) => {
    if (!selectedProject || isDemo) return;
    if (data.id) {
      // Editing existing
      const existing = selectedProject.resources.find(r => r.id === data.id);
      const urlChanged = existing?.url !== data.url;
      const updated = selectedProject.resources.map(r =>
        r.id === data.id ? { ...r, ...data, preview: urlChanged ? null : (existing?.preview || null) } : r
      );
      // Update UI immediately
      setProjects(prev => prev.map(p => p.id === selectedProject.id ? { ...p, resources: updated } : p));
      updateCtx("resources", updated);
      // Fetch preview in background if URL changed
      if (urlChanged && (data.type === "link" || data.type === "document")) {
        fetchOGPreview(data.url).then(preview => {
          if (!preview) return;
          setProjects(prev => prev.map(p => {
            if (p.id !== selectedProject.id) return p;
            const withPreview = p.resources.map(r => r.id === data.id ? { ...r, preview } : r);
            updateCtx("resources", withPreview);
            return { ...p, resources: withPreview };
          }));
        });
      }
    } else {
      // Adding new — show immediately with no preview
      const { id: _, ...rest } = data;
      const newResource = { id: generateId(), ...rest, preview: null };
      const newList = [newResource, ...(selectedProject.resources || [])];
      // Update UI immediately
      setProjects(prev => prev.map(p => p.id === selectedProject.id ? { ...p, resources: newList } : p));
      updateCtx("resources", newList);
      // Fetch OG preview in background
      if (rest.type === "link" || rest.type === "document") {
        fetchOGPreview(rest.url).then(preview => {
          if (!preview) return;
          setProjects(prev => prev.map(p => {
            if (p.id !== selectedProject.id) return p;
            const withPreview = p.resources.map(r => r.id === newResource.id ? { ...r, preview } : r);
            updateCtx("resources", withPreview);
            return { ...p, resources: withPreview };
          }));
        });
      }
    }
  };

  const deleteRes = (id) => {
    if (!selectedProject || isDemo) return;
    const updated = selectedProject.resources.filter(r => r.id !== id);
    setProjects(prev => prev.map(p => p.id === selectedProject.id ? { ...p, resources: updated } : p));
    updateCtx("resources", updated);
  };

  const uniqueTags = selectedProject ? [...new Set(selectedProject.resources.flatMap(r => r.tags || []))] : [];
  const filteredResources = selectedProject ? selectedProject.resources.filter(r => !resourceFilter || (r.tags && r.tags.includes(resourceFilter))) : [];
  const handleScroll = e => setIsScrolled(e.target.scrollTop > 60);

  const selectProject = (id) => {
    setSelectedId(id);
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-[#F1F5F9]">
      <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
    </div>
  );

  if (!user && !isDemo) return (
    <LoginScreen onGoogleLogin={handleGoogleLogin} onEmailAuth={handleEmailAuth} onMagicLink={handleMagicLink} onDemo={handleDemo} loading={loading} error={authError} />
  );

  const SidebarItemFull = ({ project }) => (
    <div onClick={() => selectProject(project.id)}
      className={`group flex items-center gap-3 px-4 py-2.5 rounded-xl cursor-pointer transition-all duration-200 ease-apple mb-1 mr-4 min-h-[44px] ${selectedId === project.id ? "bg-indigo-50 text-indigo-900 font-semibold" : "hover:bg-slate-100 text-slate-600 hover:text-slate-900"}`}>
      {project.icon ? (
        <ProjectIcon icon={project.icon} size="sm" className="shrink-0" />
      ) : (
        <div className={`w-2.5 h-2.5 rounded-full shrink-0 transition-transform duration-300 ease-apple group-hover:scale-110 ${selectedId === project.id ? "bg-indigo-500" : project.status === "active" ? "bg-slate-300" : project.status === "completed" ? "bg-emerald-300" : "bg-amber-200"}`} />
      )}
      <p className="text-sm font-medium truncate">{project.title}</p>
    </div>
  );

  // FIX 3: Removed className="!bg-transparent" which was overriding the icon's background colour
  const SidebarItemIcon = ({ project }) => (
    <div onClick={() => selectProject(project.id)} title={project.title}
      className={`flex items-center justify-center w-10 h-10 rounded-xl cursor-pointer transition-all duration-200 ease-apple mb-1 mx-auto ${selectedId === project.id ? "bg-indigo-50 ring-2 ring-indigo-200" : "hover:bg-slate-100"}`}>
      {project.icon ? (
        <ProjectIcon icon={project.icon} size="sm" />
      ) : (
        <div className={`w-3 h-3 rounded-full transition-transform duration-300 ease-apple hover:scale-125 ${selectedId === project.id ? "bg-indigo-500" : project.status === "active" ? "bg-slate-400" : project.status === "completed" ? "bg-emerald-400" : "bg-amber-300"}`} />
      )}
    </div>
  );

  // FIX 1: Section labels changed to grey (text-slate-400)
  const SidebarContent = ({ onClose }) => (
    <>
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3 text-slate-800 font-extrabold text-xl tracking-tight">
            <div className="p-2.5 bg-indigo-600 rounded-2xl text-slate-50 shadow-lg shadow-indigo-200/50 shrink-0">
              <ContinuumLogo className="w-5 h-5 text-white" />
            </div>
            <span>Continuum</span>
          </div>
          <button onClick={onClose}
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
      <div className="flex-1 overflow-y-auto px-2">
        <div className="mb-8">
          <h3 className="t-eyebrow text-slate-400 mb-3 px-4">Active</h3>
          {activeProjects.map(p => <SidebarItemFull key={p.id} project={p} />)}
        </div>
        <div className="mb-8">
          <h3 className="t-eyebrow text-slate-400 mb-3 px-4">On Hold</h3>
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
        <button onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 text-sm font-semibold text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all ease-apple active:scale-95">
          <LogOut className="w-4 h-4" /> {isDemo ? "Exit demo" : "Sign Out"}
        </button>
      </div>
    </>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&display=swap');
        body { font-family: 'Manrope', sans-serif; }
        .ease-apple { transition-timing-function: cubic-bezier(0.32, 0.72, 0, 1); }
      `}</style>
      <div className="flex flex-col h-screen text-slate-900 overflow-hidden bg-[#F1F5F9]">
        {isDemo && <DemoBanner onSignIn={() => { setIsDemo(false); setProjects([]); setSelectedId(null); }} />}
        <div className="flex flex-1 overflow-hidden relative">
          {isSidebarOpen && (
            <div className="fixed inset-0 bg-slate-900/40 z-10 md:hidden" onClick={() => setSidebarOpen(false)} />
          )}
          <div className={`hidden md:flex flex-col flex-shrink-0 bg-slate-50 border-r border-slate-200/80 shadow-sm transition-all duration-500 ease-apple overflow-hidden ${isSidebarOpen ? "w-80" : "w-16"}`}>
            {isSidebarOpen ? (
              <SidebarContent onClose={() => setSidebarOpen(false)} />
            ) : (
              <div className="flex flex-col items-center py-5 h-full">
                <button onClick={() => setSidebarOpen(true)}
                  className="p-2.5 mb-5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors ease-apple active:scale-95" title="Expand sidebar">
                  <PanelRight className="w-5 h-5" />
                </button>
                <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center mb-5 shrink-0">
                  <ContinuumLogo className="w-5 h-5 text-white" />
                </div>
                {!isDemo && (
                  <button onClick={() => { setEditingProject(null); setIsProjectModalOpen(true); }}
                    className="w-10 h-10 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-5 transition-all ease-apple active:scale-95" title="New Project">
                    <Plus className="w-5 h-5" />
                  </button>
                )}
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
          <div className={`fixed md:hidden top-0 left-0 h-full z-20 w-80 bg-slate-50 flex flex-col shadow-2xl transition-transform duration-500 ease-apple ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
            <SidebarContent onClose={() => setSidebarOpen(false)} />
          </div>

          <div className="flex-1 flex flex-col h-full overflow-hidden relative min-w-0">
            <div className={`absolute top-0 left-0 right-0 bg-[#F1F5F9]/90 backdrop-blur-xl z-30 border-b border-slate-200/50 transition-all duration-500 ease-apple transform ${isScrolled ? "translate-y-0 opacity-100 shadow-sm" : "-translate-y-full opacity-0 pointer-events-none"}`}>
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

            {selectedProject ? (
              <div className="flex-1 overflow-y-auto pb-12 scroll-smooth" onScroll={handleScroll}>
                <div className="flex items-center gap-3 px-4 pt-5 pb-2 md:hidden">
                  <button onClick={() => setSidebarOpen(true)}
                    className="p-2.5 bg-slate-50 text-slate-500 hover:text-indigo-600 rounded-full transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center shadow-sm border border-slate-200">
                    <Menu className="w-5 h-5" />
                  </button>
                  <p className="text-sm font-semibold text-slate-500 truncate">{selectedProject.title}</p>
                </div>
                <div className="w-full max-w-6xl mx-auto px-6 md:px-12 pt-10 md:pt-16 pb-12">
                  <div className="mb-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                      <div className="flex items-center gap-4">
                        <Badge color={selectedProject.status === "active" ? "green" : selectedProject.status === "completed" ? "blue" : "amber"}>
                          {selectedProject.status === "active" ? "Active" : selectedProject.status === "completed" ? "Completed" : "Paused"}
                        </Badge>
                      </div>
                      {!isDemo && (
                        <div className="flex items-center gap-2">
                          {selectedProject.status !== "completed" ? (
                            <>
                              <Button onClick={() => toggleStatus(selectedProject.id)} variant={selectedProject.status === "active" ? "secondary" : "primary"} className="h-10 px-5 text-sm">
                                {selectedProject.status === "active" ? <><PauseCircle className="w-4 h-4" /> Pause</> : <><PlayCircle className="w-4 h-4" /> Resume</>}
                              </Button>
                              <Button variant="secondary" onClick={() => markCompleted(selectedProject.id)} className="h-10 px-5 text-sm">
                                <CheckSquare className="w-4 h-4" /> Done
                              </Button>
                            </>
                          ) : (
                            <Button variant="primary" onClick={() => reopenProject(selectedProject.id)} className="h-10 px-5 text-sm">
                              <RotateCcw className="w-4 h-4" /> Reopen
                            </Button>
                          )}
                          <Button variant="icon" onClick={() => { setEditingProject(selectedProject); setIsProjectModalOpen(true); }} className="h-10 w-10">
                            <Settings className="w-5 h-5" />
                          </Button>
                        </div>
                      )}
                    </div>
                    <div className="flex items-start gap-4 mb-8">
                      {selectedProject.icon && <ProjectIcon icon={selectedProject.icon} size="lg" className="mt-1 shrink-0" />}
                      <h1 className="text-5xl font-semibold tracking-tight text-slate-900 break-words leading-[1.1]">
                        {selectedProject.title}
                      </h1>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 border-t border-slate-200/60 pt-8">
                      <div className="md:col-span-3 space-y-3">
                        <p className="t-eyebrow text-slate-500">Start Date</p>
                        <div className="flex items-center gap-2 text-slate-700 font-medium text-base">
                         <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                          {selectedProject.startDate ? new Date(selectedProject.startDate).toLocaleDateString() : "N/A"}
                        </div>
                      </div>
                      <div className="md:col-span-9 space-y-3">
                        <p className="t-eyebrow text-slate-500">Description</p>
                        <p className="text-base text-slate-600 leading-relaxed">{selectedProject.description || "No description provided."}</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="relative flex items-center bg-slate-50 p-1 rounded-full w-full max-w-md mx-auto md:mx-0 shadow-sm border border-slate-200 mb-10 z-0">
                      <div className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-indigo-100 rounded-full transition-all duration-300 ease-apple ${activeTab === "overview" ? "left-1 translate-x-0" : "translate-x-full left-0"}`} />
                      <button onClick={() => setActiveTab("overview")}
                        className={`relative z-10 flex-1 h-9 px-6 text-sm font-bold rounded-full text-center transition-colors duration-300 ease-apple ${activeTab === "overview" ? "text-indigo-900" : "text-slate-500 hover:text-slate-700"}`}>
                        Overview
                      </button>
                      <button onClick={() => setActiveTab("resources")}
                        className={`relative z-10 flex-1 h-9 px-6 text-sm font-bold rounded-full text-center transition-colors duration-300 ease-apple ${activeTab === "resources" ? "text-indigo-900" : "text-slate-500 hover:text-slate-700"}`}>
                        Resources
                      </button>
                    </div>
                    <div className="min-h-[400px]">
                      <div key={activeTab} className="animate-in fade-in duration-500 ease-apple">
                        {activeTab === "overview" ? (
                          <OverviewTab project={selectedProject} onUpdate={handleBriefingUpdate} onUpdateCtx={updateCtx} isDemo={isDemo} />
                        ) : (
                          <div>
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="text-slate-500 text-sm font-semibold mr-2">Filter by:</p>
                                <button onClick={() => setResourceFilter(null)}
                                  className={`px-4 py-1.5 text-xs font-bold rounded-full border transition-all ease-apple active:scale-95 ${resourceFilter === null ? "bg-indigo-600 text-slate-50 border-indigo-600 shadow-md shadow-indigo-200" : "bg-slate-50 text-slate-500 border-slate-200 hover:border-indigo-300 hover:text-indigo-600"}`}>
                                  All
                                </button>
                                {uniqueTags.map(tag => (
                                  <button key={tag} onClick={() => setResourceFilter(tag === resourceFilter ? null : tag)}
                                    className={`px-4 py-1.5 text-xs font-bold rounded-full border transition-all ease-apple active:scale-95 ${resourceFilter === tag ? "bg-indigo-600 text-slate-50 border-indigo-600 shadow-md shadow-indigo-200" : "bg-slate-50 text-slate-500 border-slate-200 hover:border-indigo-300 hover:text-indigo-600"}`}>
                                    {tag}
                                  </button>
                                ))}
                              </div>
                              {!isDemo && (
                                <Button variant="primary" onClick={() => { setEditingResource(null); setIsResourceModalOpen(true); }} className="pl-6 pr-8 w-full md:w-auto">
                                  <Plus className="w-5 h-5" /> Add Resource
                                </Button>
                              )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                              {filteredResources.map(resource => (
                                <div key={resource.id} className="group bg-slate-50 rounded-[28px] overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-apple flex flex-col h-full border border-slate-200">
                                  {resource.type === "image" ? (
                                    <div className="h-40 bg-slate-100 w-full relative cursor-pointer overflow-hidden" onClick={() => window.open(resource.url, "_blank")}>
                                      <img src={resource.url} alt={resource.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        onError={e => { e.target.onerror = null; e.target.src = "https://placehold.co/600x400/f1f5f9/94a3b8?text=No+Preview"; }} />
                                      <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 duration-300">
                                        <div className="bg-slate-50/90 p-3 rounded-full backdrop-blur-md shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                          <ExternalLink className="w-6 h-6 text-slate-900" />
                                        </div>
                                      </div>
                                    </div>
                                  ) : resource.preview?.image ? (
                                    <div className="h-40 w-full relative cursor-pointer overflow-hidden bg-slate-100" onClick={() => window.open(resource.url, "_blank")}>
                                      <img src={resource.preview.image} alt={resource.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        onError={e => { e.target.onerror = null; e.target.style.display = "none"; }} />
                                      <div className="absolute bottom-0 left-0 right-0 px-4 py-2.5 flex items-center gap-2"
                                        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55), transparent)" }}>
                                        <img src={resource.preview.favicon} alt="" className="w-4 h-4 rounded-sm shrink-0"
                                          onError={e => { e.target.style.display = "none"; }} />
                                        <span className="text-white text-[11px] font-semibold truncate opacity-90">{resource.preview.hostname}</span>
                                      </div>
                                      <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 duration-300">
                                        <div className="bg-slate-50/90 p-3 rounded-full backdrop-blur-md shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                          <ExternalLink className="w-6 h-6 text-slate-900" />
                                        </div>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className={`h-40 w-full cursor-pointer flex flex-col items-center justify-center border-b overflow-hidden transition-all duration-300 ${resource.type === "document" ? "bg-indigo-50 border-indigo-100" : "bg-blue-50 border-blue-100"}`}
                                      onClick={() => window.open(resource.url, "_blank")}>
                                      {resource.preview?.favicon ? (
                                        <div className="flex flex-col items-center gap-3">
                                          <div className={`w-16 h-16 bg-slate-50 rounded-2xl shadow-lg flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 ease-apple ${resource.type === "document" ? "shadow-indigo-100" : "shadow-blue-100"}`}>
                                            <img src={resource.preview.favicon} alt="" className="w-9 h-9 rounded-md"
                                              onError={e => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }} />
                                            <div style={{ display: "none" }} className="w-9 h-9 items-center justify-center">
                                              {resource.type === "document" ? <FileIcon className="w-8 h-8 text-indigo-400" /> : <LinkIcon className="w-8 h-8 text-blue-400" />}
                                            </div>
                                          </div>
                                          <span className={`t-eyebrow ${resource.type === "document" ? "text-indigo-400" : "text-blue-400"}`}>
                                            {resource.preview.hostname?.replace("www.", "")}
                                          </span>
                                        </div>
                                      ) : (
                                        <div className="flex flex-col items-center gap-3">
                                          <div className={`w-20 h-20 bg-slate-50 rounded-3xl shadow-lg flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 ease-apple ${resource.type === "document" ? "shadow-indigo-100" : "shadow-blue-100"}`}>
                                            {resource.type === "document" ? <FileIcon className="w-10 h-10 text-indigo-500" /> : <LinkIcon className="w-10 h-10 text-blue-500" />}
                                          </div>
                                          <span className={``t-eyebrow ${resource.type === "document" ? "text-indigo-400" : "text-blue-400"}`}>
                                            {resource.type === "document" ? "Document" : "Web Link"}
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                  <div className="p-8 flex-1 flex flex-col">
                                    <div className="flex items-start justify-between mb-4">
                                      <div className={`p-2.5 rounded-xl ${resource.type === "link" ? "bg-blue-50 text-blue-600" : resource.type === "image" ? "bg-purple-50 text-purple-600" : "bg-indigo-50 text-indigo-600"}`}>
                                        {resource.type === "link" && <LinkIcon className="w-5 h-5" />}
                                        {resource.type === "image" && <ImageIcon className="w-5 h-5" />}
                                        {resource.type === "document" && <FileIcon className="w-5 h-5" />}
                                      </div>
                                      {!isDemo && (
                                        <div className="flex gap-1 -mr-2">
                                          <Button variant="icon" onClick={() => { setEditingResource(resource); setIsResourceModalOpen(true); }} className="opacity-0 group-hover:opacity-100 hover:bg-slate-100 hover:text-indigo-600">
                                            <Edit2 className="w-4 h-4" />
                                          </Button>
                                          <Button variant="icon" onClick={() => deleteRes(resource.id)} className="opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-500">
                                            <Trash2 className="w-4 h-4" />
                                          </Button>
                                        </div>
                                      )}
                                    </div>
                                    <h3 className="font-bold text-xl text-slate-900 truncate mb-3 tracking-tight">{resource.title}</h3>
                                    {resource.description && <p className="text-sm text-slate-500 mb-8 line-clamp-2 leading-relaxed flex-1 font-medium">{resource.description}</p>}
                                    <div className="mt-auto pt-6 border-t border-slate-200 flex items-center justify-between">
                                      <div className="flex flex-wrap gap-2">
                                        {resource.tags?.slice(0, 2).map((tag, i) => (
                                          <span key={i} className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-500 border border-slate-200">{tag}</span>
                                        ))}
                                        {resource.tags?.length > 2 && <span className="text-[10px] text-slate-400 self-center pl-1 font-bold">+{resource.tags.length - 2}</span>}
                                      </div>
                                      <a href={resource.url} target="_blank" rel="noopener noreferrer"
                                        className="p-2.5 rounded-full hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 transition-colors">
                                        <ExternalLink className="w-5 h-5" />
                                      </a>
                                    </div>
                                  </div>
                                </div>
                              ))}
                              {!isDemo && (
                                <button onClick={() => { setEditingResource(null); setIsResourceModalOpen(true); }}
                                  className="rounded-[28px] border-2 border-dashed border-slate-300/80 flex flex-col items-center justify-center h-full min-h-[260px] text-slate-400 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50/30 transition-all duration-300 p-8 group ease-apple">
                                  <div className="w-20 h-20 rounded-[2rem] bg-slate-100 group-hover:bg-indigo-100 transition-colors mb-6 flex items-center justify-center duration-300">
                                    <Plus className="w-10 h-10 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                                  </div>
                                  <span className="font-bold text-xl tracking-tight">Add Resource</span>
                                </button>
                              )}
                            </div>
                          </div>
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

            {!isDemo && isResourceModalOpen && <ResourceModal isOpen={isResourceModalOpen} onClose={() => setIsResourceModalOpen(false)} onSubmit={handleSaveResource} resource={editingResource} />}
            {!isDemo && isProjectModalOpen && (
              <ProjectModal isOpen={isProjectModalOpen} onClose={() => setIsProjectModalOpen(false)} project={editingProject}
                onSubmit={data => { editingProject ? updateProject(editingProject.id, data) : createProject(data); setIsProjectModalOpen(false); }}
                onDelete={id => { deleteProject(id); setIsProjectModalOpen(false); }} />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
